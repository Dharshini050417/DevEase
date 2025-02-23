const axios = require("axios");
const xmlbuilder = require("xmlbuilder");

const JENKINS_URL = process.env.JENKINS_URL;
const JENKINS_USER = process.env.JENKINS_USER;
const JENKINS_API_TOKEN = process.env.JENKINS_API_TOKEN;

const auth = {
    auth: { username: JENKINS_USER, password: JENKINS_API_TOKEN },
};

// ✅ Function to Create Jenkins Pipeline
const createJenkinsPipeline = async (req, res) => {
    try {
        const { userId, repoUrl, branchName, services } = req.body;
        const jobName = `pipeline-${userId}`;

        // Jenkins Job Configuration XML (Referencing Jenkinsfile.groovy)
        const xmlConfig = xmlbuilder.create("flow-definition")
            .att("plugin", "workflow-job@2.39")
            .ele("actions").up()
            .ele("description", `Pipeline for ${repoUrl}`).up()
            .ele("keepDependencies", "false").up()
            .ele("properties").up()
            .ele("definition", { class: "org.jenkinsci.plugins.workflow.cps.CpsScmFlowDefinition", plugin: "workflow-cps@2.89" })
                .ele("scm", { class: "hudson.plugins.git.GitSCM", plugin: "git@4.7.1" })
                    .ele("configVersion", "2").up()
                    .ele("userRemoteConfigs")
                        .ele("hudson.plugins.git.UserRemoteConfig")
                            .ele("url", repoUrl).up()
                            .ele("credentialsId", "jenkins-git-credentials").up()
                        .up()
                    .up()
                    .ele("branches")
                        .ele("hudson.plugins.git.BranchSpec")
                            .ele("name", branchName).up()
                        .up()
                    .up()
                .up()
                .ele("scriptPath", "Jenkinsfile.groovy").up()
                .ele("lightweight", "true").up()
            .up()
            .end({ pretty: true });

        // 1️⃣ Create the Pipeline Job in Jenkins
        await axios.post(`${JENKINS_URL}/createItem?name=${jobName}`, xmlConfig, {
            headers: { "Content-Type": "application/xml" },
            ...auth,
        });

        // 2️⃣ Trigger the Pipeline Build with Parameters
        await axios.post(`${JENKINS_URL}/job/${jobName}/buildWithParameters`, null, {
            ...auth,
            params: {
                REPO_URL: repoUrl,
                BRANCH: branchName,
            },
        });

        res.status(200).json({ message: "Pipeline created and triggered!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Pipeline creation failed", error: error.message });
    }
};

module.exports = { createJenkinsPipeline };