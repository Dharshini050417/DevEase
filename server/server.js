const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const authRoutes = require("./routes/authRoute");
const projectRoutes = require("./routes/projectRoute");
const pipelineRoutes = require("./routes/pipelineRoute");
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
const port = parseInt(process.env.PORT || "5000", 10) || 5000;

app.use("/api/auth", authRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/pipeline", pipelineRoutes);

app.listen(port, () => console.log(`Server running on port ${port}`));
