const express = require("express");
const {
  signup,
  login,
  getUser,
  logout,
} = require("../controllers/authController.js");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/user", authMiddleware, getUser);
router.post("/logout", authMiddleware, logout);

module.exports = router;
