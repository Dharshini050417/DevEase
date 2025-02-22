const axios = require("axios");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const supabase = require("../config/db");
const { execSync } = require("child_process");

const JENKINS_URL = process.env.JENKINS_URL;
const JENKINS_USER = process.env.JENKINS_USER;
const JENKINS_API_TOKEN = process.env.JENKINS_API_TOKEN;
const SSH_KEY_PATH = "~/.ssh/temp.pem"; // Private key for SSH
const EC2_USER = "ubuntu"; // EC2 user for SSH
const EC2_IP = process.env.EC2_PUBLIC_IP; // Jenkins instance IP

const auth = {
  auth: { username: JENKINS_USER, password: JENKINS_API_TOKEN },
};

// ✅ Function to Parse Environment Variables
const parseEnvVars = (envText) => {
  if (!envText) return {};
  return envText.split("\n").reduce((acc, line) => {
    const [key, value] = line.split("=");
    if (key && value) {
      acc[key.trim()] = value.trim();
    }
    return acc;
  }, {});
};

// ✅ Function to Generate Docker Files in Jenkins Instance
const generateDockerFiles = (jobName, services) => {
  const jobPath = `/home/ubuntu/workspace/${jobName}`;

  let composeContent = `version: '3'\nservices:\n`;

  services.forEach((service) => {
    const serviceDir = `${jobPath}/${service.name}`;
    const envVars = parseEnvVars(service.envVars);

    let envFileContent = Object.entries(envVars)
      .map(([key, value]) => `${key}=${value}`)
      .join("\n");

    const dockerfileContent = `
FROM ${service.baseImage || "node:18-alpine"}
WORKDIR /app
COPY . .
${envFileContent ? "COPY .env .env" : ""}
RUN ${service.buildCommand
      .split(" && ")
      .map((cmd) => `RUN ${cmd}`)
      .join("\n")}
EXPOSE ${service.port || "3000"}
CMD ["sh", "-c", "${service.runCommand}"]
        `.trim();

    // ✅ Store `.env` and `Dockerfile` in Jenkins Instance
    execSync(`
            ssh -i ${SSH_KEY_PATH} ${EC2_USER}@${EC2_IP} "mkdir -p ${serviceDir} && chmod 777 ${serviceDir}"
            echo '${envFileContent}' | ssh -i ${SSH_KEY_PATH} ${EC2_USER}@${EC2_IP} "cat > ${serviceDir}/.env"
            echo '${dockerfileContent}' | ssh -i ${SSH_KEY_PATH} ${EC2_USER}@${EC2_IP} "cat > ${serviceDir}/Dockerfile"
        `);

    // ✅ Add service to `docker-compose.yml`
    composeContent +=
      `
  ${service.name}:
    build: ./${service.name}
    ports:
      - "${service.port}:${service.port}"
    env_file: ${envFileContent ? `./${service.name}/.env` : "[]"}
        `.trim() + "\n";
  });

  // ✅ Generate `docker-compose.yml`
  execSync(`
        ssh -i ${SSH_KEY_PATH} ${EC2_USER}@${EC2_IP} "echo '${composeContent}' > ${jobPath}/docker-compose.yml"
    `);
  console.log(`✅ Docker files stored in Jenkins instance at ${jobPath}`);
};

// ✅ Pipeline Creation API
const createJenkinsPipeline = async (req, res) => {
  const { userId, repoUrl, branchName, services } = req.body;
  const jobName = `project-${Date.now()}`;

  try {
    // ✅ Step 1: Insert Project into Supabase
    const { error } = await supabase.from("projects").insert([
      {
        user_id: userId.trim(),
        repo_url: repoUrl,
        branch_name: branchName,
        services,
      },
    ]);

    if (error) return res.status(400).json({ error: error.message });

    // ✅ Step 2: Generate Docker Files in Jenkins Instance
    generateDockerFiles(jobName, services);

    // ✅ Step 3: Jenkins Pipeline Configuration
    const jenkinsConfig = `
pipeline {
    agent any
    triggers {
        githubPush()
    }
    stages {
        stage('Clone Repository') {
            steps {
                sh '''
                ssh -i ${SSH_KEY_PATH} ${EC2_USER}@${EC2_IP} <<EOF
                    sudo mkdir -p /home/ubuntu/workspace/${jobName}
                    cd /home/ubuntu/workspace/${jobName}
                    sudo git clone -b ${branchName} ${repoUrl} .
                EOF
                '''
            }
        }
        stage('Run Terraform to Create Instance') {
            steps {
                sh '''
                ssh -i ${SSH_KEY_PATH} ${EC2_USER}@${EC2_IP} <<EOF
                    cd /home/ubuntu/terraform
                    sudo terraform init
                    sudo terraform apply -auto-approve
                EOF
                '''
            }
        }
        stage('Get Instance IP') {
            steps {
                script {
                    env.INSTANCE_IP = sh(script: '''
                    ssh -i ~/.ssh/temp.pem ${EC2_USER}@${EC2_IP} "terraform output -raw instance_ip"
                    ''', returnStdout: true).trim()

                    echo "✅ EC2 Instance Public IP: ${env.INSTANCE_IP}"
                }
            }
        }
        stage('Install Docker on Instance') {
            steps {
                sh '''
                ssh -i ${SSH_KEY_PATH} ${EC2_USER}@${INSTANCE_IP} <<EOF
                    sudo apt update
                    sudo apt install -y docker.io docker-compose
                    sudo systemctl start docker
                    sudo systemctl enable docker
                EOF
                '''
            }
        }
        stage('Copy Docker Files to Instance') {
            steps {
                sh '''
                scp -i ${SSH_KEY_PATH} -r ${EC2_USER}@${EC2_IP}:/home/ubuntu/workspace/${jobName} ${EC2_USER}@${INSTANCE_IP}:/home/ubuntu/project/
                '''
            }
        }
        stage('Deploy with Docker') {
            steps {
                script {
                    def output = sh(script: '''
                    ssh -i ${SSH_KEY_PATH} ${EC2_USER}@${INSTANCE_IP} <<EOF
                        cd /home/ubuntu/project
                        sudo docker-compose up -d
                        echo "Running Containers:"
                        sudo docker ps --format "table {{.ID}}\t{{.Names}}\t{{.Ports}}"
                    EOF
                    ''', returnStdout: true).trim()

                    echo "Deployment Output: \\n\${output}"
                    env.DOCKER_OUTPUT = output
                }
            }
        }
    }
}
`;

    // ✅ Step 4: Create Jenkins Job
    await axios.post(
      `${JENKINS_URL}/createItem?name=${jobName}`,
      `<project>
                <definition class="org.jenkinsci.plugins.workflow.cps.CpsFlowDefinition">
                    <script><![CDATA[${jenkinsConfig}]]></script>
                    <sandbox>true</sandbox>
                </definition>
            </project>`,
      { headers: { "Content-Type": "text/xml" }, ...auth }
    );

    // ✅ Step 5: Trigger the First Build
    await axios.post(`${JENKINS_URL}/job/${jobName}/build`, {}, auth);

    res.json({ message: "Pipeline created & first build triggered", jobName });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createJenkinsPipeline };
