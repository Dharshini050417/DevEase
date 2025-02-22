const express = require("express");
const dotenv = require("dotenv");
const route = require("./routes/route");

dotenv.config();

const app = express();

app.use(express.json());
const port = parseInt(process.env.PORT || "5000", 10) || 5000;

app.use("/api", route);

app.listen(port, () => console.log(`App is listening at port ${port}`));
