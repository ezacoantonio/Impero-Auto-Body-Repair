const Part = require("../models/Part");

exports.createPart = async (req, res) => {
  try {
    const part = new Part({
      ...req.body,
      clientId: req.params.clientId,
    });
    await part.save();
    res.status(201).json(part);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getClientParts = async (req, res) => {
  try {
    const parts = await Part.find({ clientId: req.params.clientId });
    res.json(parts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deletePart = async (req, res) => {
  try {
    const part = await Part.findOneAndDelete({
      _id: req.params.id,
      clientId: req.params.clientId,
    });
    if (!part) return res.status(404).json({ error: "Part not found" });
    res.json({ message: "Part deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
