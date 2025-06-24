const express = require("express");
const router = express.Router();
const {
  saveReport,
  completeJob,
} = require("../controllers/serviceReportController");

router.post("/clients/:clientId/reports", saveReport);
router.put("/reports/:reportId/complete", completeJob);

module.exports = router;
