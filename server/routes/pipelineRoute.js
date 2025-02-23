const express = require("express");
const { createJenkinsPipeline } = require("../controllers/pipelineController");

const router = express.Router();

router.post("/create", createJenkinsPipeline);

module.exports = router;