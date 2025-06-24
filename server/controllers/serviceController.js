const ServiceRecord = require("../models/ServiceRecord");

exports.createService = async (req, res) => {
  try {
    const service = new ServiceRecord({
      ...req.body,
      clientId: req.params.clientId,
    });
    await service.save();
    res.status(201).json(service);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getClientServices = async (req, res) => {
  try {
    const services = await ServiceRecord.find({
      clientId: req.params.clientId,
    });
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateService = async (req, res) => {
  try {
    const service = await ServiceRecord.findOneAndUpdate(
      { _id: req.params.id, clientId: req.params.clientId },
      req.body,
      { new: true }
    );
    if (!service) return res.status(404).json({ error: "Service not found" });
    res.json(service);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const service = await ServiceRecord.findOneAndDelete({
      _id: req.params.id,
      clientId: req.params.clientId,
    });
    if (!service) return res.status(404).json({ error: "Service not found" });
    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
