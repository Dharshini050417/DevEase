const express = require("express");
const { addProject, getProjects } = require("../controllers/projectController");

const router = express.Router();

router.post("/add", addProject);
router.get("/user/:userId", getProjects);

module.exports = router;
