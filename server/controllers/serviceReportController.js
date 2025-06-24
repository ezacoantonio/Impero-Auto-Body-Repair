const ServiceReport = require("../models/ServiceReport");

exports.saveReport = async (req, res) => {
  try {
    const { clientId } = req.params;
    const { services, items, parts } = req.body;

    const report = await ServiceReport.findOneAndUpdate(
      { clientId, status: "draft" },
      {
        clientId,
        services,
        items,
        parts,
        lastSaved: new Date(),
      },
      { upsert: true, new: true }
    );

    res.status(200).json(report);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.completeJob = async (req, res) => {
  try {
    const { reportId } = req.params;
    const report = await ServiceReport.findByIdAndUpdate(
      reportId,
      {
        status: "completed",
        completedAt: new Date(),
      },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    // Generate invoice data
    const invoice = {
      ...report.toObject(),
      total: calculateTotal(report),
      invoiceNumber: `INV-${Date.now()}`,
    };

    res.status(200).json(invoice);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

function calculateTotal(report) {
  const servicesTotal = report.services.reduce((sum, s) => sum + s.price, 0);
  const partsTotal = report.parts.reduce(
    (sum, p) => sum + p.price * p.quantity,
    0
  );
  return servicesTotal + partsTotal;
}
