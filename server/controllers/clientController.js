const Client = require("../models/Client");
const debug = require("debug")("server:controller");

exports.createClient = async (req, res) => {
  try {
    debug("Creating client:", req.body);
    const client = new Client({
      plateNumber: req.body.plateNumber,
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email || null,
      vehicleImage:
        req.body.vehicleImage || "https://i.imgur.com/default-car.jpg",
    });

    await client.save();
    res.status(201).json(client);
  } catch (err) {
    debug("Error creating client:", err);
    res.status(400).json({ error: err.message });
  }
};

exports.getClients = async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (err) {
    debug("Error fetching clients:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.deleteClient = async (req, res) => {
  try {
    const { plateNumber } = req.params;

    const client = await Client.findOne({ plateNumber });
    if (!client) {
      return res.status(404).json({
        success: false,
        error: `Client with plate ${plateNumber} not found`,
      });
    }

    await Client.deleteOne({ plateNumber });

    res.json({
      success: true,
      message: `Client ${plateNumber} deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.updateClient = async (req, res) => {
  try {
    const { id } = req.params;

    const allowedFields = [
      "plateNumber",
      "name",
      "phone",
      "email",
      "vehicleImage",
      "status",
    ];

    const updateData = {};
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        updateData[key] = req.body[key];
      }
    }

    const updatedClient = await Client.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedClient) {
      return res.status(404).json({ error: "Client not found" });
    }

    res.status(200).json(updatedClient);
  } catch (error) {
    console.error("Update Error:", error);
    res.status(400).json({ error: error.message });
  }
};
