require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const debug = require("debug")("server");

// Import routes
const clientRoutes = require("./routes/clients");
const servicesRouter = require("./routes/services");
const vehicleItemsRouter = require("./routes/vehicleItems");
const partsRouter = require("./routes/parts");
const serviceReportsRouter = require("./routes/serviceReports");

// Initialize Express app
const app = express();

// Database connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => debug("MongoDB Connected"))
  .catch((err) => debug("MongoDB Connection Error:", err));

// Middleware
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: "*",
  })
);

app.use(express.json({ limit: "50mb" }));

// Request logging
let loggerMiddleware;
try {
  const morgan = require("morgan");
  loggerMiddleware = morgan("dev");
} catch {
  loggerMiddleware = (req, res, next) => {
    debug(`${req.method} ${req.path}`);
    next();
  };
}
app.use(loggerMiddleware);

// Routes
app.use("/api/clients", clientRoutes);
app.use("/api", servicesRouter);
app.use("/api", vehicleItemsRouter);
app.use("/api", partsRouter);
app.use("/api", serviceReportsRouter);
// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "UP",
    db: mongoose.connection.readyState === 1 ? "CONNECTED" : "DISCONNECTED",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  debug("Error:", err);
  res.status(500).json({
    error: err.message || "Internal Server Error",
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  debug(`Server running on port ${PORT}`);
  console.log(`Server ready on http://localhost:${PORT}`);
});

module.exports = app;
