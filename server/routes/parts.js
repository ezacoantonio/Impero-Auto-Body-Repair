// routes/parts.js
const express = require("express");
const router = express.Router();
const {
  createPart,
  getClientParts,
  deletePart,
} = require("../controllers/partController");

router.post("/clients/:clientId/parts", createPart);
router.get("/clients/:clientId/parts", getClientParts);
router.delete("/parts/:id", deletePart);

module.exports = router;
