const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const supabase = require("../config/db");

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          name: name.trim(),
          email: email.toLowerCase().trim(),
          password: hashedPassword,
        },
      ])
      .select("*");

    if (error) return res.status(400).json({ error: error.message });

    res
      .status(201)
      .json({ message: "User registered successfully", user: data[0] });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email.toLowerCase().trim())
      .single();
    if (error || !data)
      return res.status(401).json({ error: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, data.password);
    if (!isMatch)
      return res.status(401).json({ error: "Invalid email or password" });

    const token = jwt.sign({ userId: data.id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({
      token,
      user: { id: data.id, name: data.name, email: data.email },
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

const getUser = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", req.user.userId)
      .single();
    if (error || !data)
      return res.status(404).json({ error: "User not found" });

    res.json({ user: { id: data.id, name: data.name, email: data.email } });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

const blacklist = new Map();

const logout = (req, res) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(400).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    blacklist.set(token, decoded.exp);

    res.json({ message: "Logged out successfully" });
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

const isTokenBlacklisted = (token) => {
  const expiry = blacklist.get(token);
  if (!expiry) return false;
  if (Date.now() >= expiry * 1000) {
    blacklist.delete(token);
    return false;
  }
  return true;
};

module.exports = { signup, login, getUser, logout, isTokenBlacklisted };
