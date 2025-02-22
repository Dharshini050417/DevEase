const express = require("express");
const { createJenkinsPipeline } = require("../controllers/pipelineController");
const { getDeploymentDetails } = require("../controllers/projectController");

const router = express.Router();

router.post("/create", createJenkinsPipeline);
router.get("/deployment/:projectId", getDeploymentDetails); // New Route

module.exports = router;
