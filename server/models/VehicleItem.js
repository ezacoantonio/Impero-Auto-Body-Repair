const mongoose = require("mongoose");

const vehicleItemSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    name: { type: String, required: true },
    checked: { type: Boolean, default: false },
    condition: {
      type: String,
      enum: ["good", "fair", "poor", "broken", null],
      default: null,
    },
    notes: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("VehicleItem", vehicleItemSchema);
