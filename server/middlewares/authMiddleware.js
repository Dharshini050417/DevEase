const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { isTokenBlacklisted } = require("../controllers/authController");

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token)
    return res.status(401).json({ error: "No token, authorization denied" });

  if (isTokenBlacklisted(token))
    return res
      .status(401)
      .json({ error: "Token is blacklisted, please log in again" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = authMiddleware;
