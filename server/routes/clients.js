const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const {
  createClient,
  getClients,
  deleteClient, // Now properly destructured
} = require("../controllers/clientController");

const validateClient = [
  check("plateNumber").not().isEmpty().trim(),
  check("name").not().isEmpty().trim(),
  check("phone").isMobilePhone().trim(),
  check("email").optional().isEmail().normalizeEmail(),
];

router.post(
  "/",
  validateClient,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  createClient // Use the destructured version
);

router.get("/", getClients); // Use the destructured version
router.delete("/:plateNumber", deleteClient); // Now this will work

module.exports = router;
