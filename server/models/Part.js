const mongoose = require("mongoose");

const partSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    name: { type: String, required: true },
    quantity: { type: Number, default: 1, min: 1 },
    price: { type: Number, required: true, min: 0 },
    supplier: String,
    warranty: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Part", partSchema);
