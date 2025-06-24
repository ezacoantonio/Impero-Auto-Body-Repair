// routes/services.js
const express = require("express");
const router = express.Router();
const {
  createService,
  getClientServices,
  updateService,
  deleteService,
} = require("../controllers/serviceController");

router.post("/clients/:clientId/services", createService);
router.get("/clients/:clientId/services", getClientServices);
router.put("/services/:id", updateService);
router.delete("/services/:id", deleteService);

module.exports = router;
