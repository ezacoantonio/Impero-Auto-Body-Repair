const VehicleItem = require("../models/VehicleItem");

exports.getVehicleItems = async (req, res) => {
  try {
    const items = await VehicleItem.find({ clientId: req.params.clientId });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateVehicleItems = async (req, res) => {
  try {
    // Upsert multiple items
    const operations = req.body.map((item) => ({
      updateOne: {
        filter: { clientId: req.params.clientId, name: item.name },
        update: { $set: item },
        upsert: true,
      },
    }));

    await VehicleItem.bulkWrite(operations);
    const updatedItems = await VehicleItem.find({
      clientId: req.params.clientId,
    });
    res.json(updatedItems);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
