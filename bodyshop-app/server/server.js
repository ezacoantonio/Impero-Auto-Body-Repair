import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import "./src/models/Job.js"; // register Job BEFORE routes
import clientRoutes from "./src/routes/clients.js";
import invoiceRoutes from "./src/routes/invoices.js";

dotenv.config();

const app = express();

// Security / logs
app.use(helmet());
app.use(morgan("tiny"));

// CORS (lock down in prod)
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";
app.use(cors({ origin: CORS_ORIGIN }));

// JSON
app.use(express.json());

// API routes
app.use("/api/clients", clientRoutes);
app.use("/api/invoices", invoiceRoutes);

// Health check (Render likes this)
app.get("/healthz", (_req, res) => res.send("ok"));

// Mongo
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Start
const PORT = process.env.PORT || 5001; // Render supplies PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
