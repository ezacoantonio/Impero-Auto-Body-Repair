require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("Connection error:", err));

// Test Route
app.get("/", (req, res) => res.send("Template Server Ready"));

// Start
app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
