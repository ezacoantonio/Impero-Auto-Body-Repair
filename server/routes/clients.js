const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const {
  createClient,
  getClients,
  deleteClient,
  updateClient,
} = require("../controllers/clientController");

// Validation for creating a client
const validateNewClient = [
  check("plateNumber").not().isEmpty().trim(),
  check("name").not().isEmpty().trim(),
  check("phone").isMobilePhone().trim(),
  check("email").optional().isEmail().normalizeEmail(),
];

// Validation for updating a client
const validateUpdateClient = [
  check("name").optional().trim(),
  check("phone").optional().trim(),
  check("email").optional().isEmail().normalizeEmail(),
  check("vehicleImage").optional().isString().trim(),
];

// ===== Routes =====

// Create a new client
router.post(
  "/",
  validateNewClient,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  createClient
);

// Update a client by MongoDB _id
router.put(
  "/:id",
  validateUpdateClient,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  updateClient
);

// Get all clients
router.get("/", getClients);

// Delete a client by plate number
router.delete("/:plateNumber", deleteClient);

module.exports = router;
