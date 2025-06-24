// routes/vehicleItems.js
const express = require("express");
const router = express.Router();
const {
  getVehicleItems,
  updateVehicleItems,
} = require("../controllers/vehicleController");

router.get("/clients/:clientId/items", getVehicleItems);
router.put("/clients/:clientId/items", updateVehicleItems);

module.exports = router; // Critical - must export router directly
