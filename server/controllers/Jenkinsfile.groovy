pipeline {
    agent any
    
    environment {
        REPO_URL = "${env.REPO_URL}"
        BRANCH = "${env.BRANCH}"
        JENKINS_CRUMB = "de8d068085c2301d4f468bb8336dd22931f69bea29026885b9169d4e7b60cc86"
        CRUMB_REQUEST_FIELD = "Jenkins-Crumb"
    }
    
    stages {
        stage('Clone Repository') {
            steps {
                script {
                    sh "rm -rf workspace || true"
                    sh "git clone -b $BRANCH $REPO_URL workspace"
                }
            }
        }

        stage('Generate .env and Dockerfiles') {
            steps {
                script {
                    def services = readJSON file: 'workspace/services.json'
                    
                    for (service in services) {
                        writeFile file: "workspace/${service.name}/.env", text: service.envVars
                        writeFile file: "workspace/${service.name}/Dockerfile", text: """
                        FROM ${service.baseImage}
                        WORKDIR /app
                        COPY . .
                        RUN ${service.buildCommand}
                        CMD ${service.runCommand}
                        EXPOSE ${service.port}
                        """
                    }
                }
            }
        }

        stage('Generate docker-compose.yml') {
            steps {
                script {
                    def services = readJSON file: 'workspace/services.json'
                    def composeContent = "version: '3.8'\nservices:\n"
                    
                    for (service in services) {
                        composeContent += """
                        ${service.name}:
                            build: ${service.name}
                            ports:
                                - "${service.port}:${service.port}"
                            env_file:
                                - ${service.name}/.env
                        """
                    }
                    writeFile file: "workspace/docker-compose.yml", text: composeContent
                }
            }
        }

        stage('Setup Terraform for Project') {
            steps {
                script {
                    def infraPath = "/var/bin/jenkins/infrastructure/${env.PROJECT_ID}"
                    sh """
                        mkdir -p ${infraPath}
                        cp -r /var/lib/jenkins/terraform/* ${infraPath}
                        sudo chown -R jenkins:jenkins ${infraPath}
                        sudo chmod -R 775 ${infraPath}
                    """
                }
            }
        }

        stage('Provision EC2 Instance with Terraform') {
            steps {
                script {
                    def infraPath = "/var/bin/jenkins/infrastructure/${env.PROJECT_ID}"
                    sh """
                        cd ${infraPath}
                        terraform init
                        terraform apply -auto-approve
                        
                        if [ -f "terraform.tfstate" ]; then
                            sudo chown jenkins:jenkins terraform.tfstate*
                            sudo chmod 664 terraform.tfstate*
                        fi
                    """
                }
            }
        }

        stage('Deploy to EC2 Instance') {
            steps {
                script {
                    def instanceIp = sh(script: "terraform output instance_ip", returnStdout: true).trim()
                    sshagent(['jenkins-ssh-key']) {
                        sh """
                        ssh -o StrictHostKeyChecking=no ubuntu@${instanceIp} << EOF
                        sudo apt update
                        sudo apt install -y docker.io docker-compose
                        rm -rf app || true
                        git clone $REPO_URL app
                        cd app
                        docker-compose up -d
                        EOF
                        """
                    }
                }
            }
        }
    }
}