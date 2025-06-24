const mongoose = require("mongoose");

const serviceRecordSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    serviceType: { type: String, enum: ["body", "mechanic"], required: true },
    name: { type: String, required: true },
    note: String,
    price: { type: Number, required: true, min: 0 },
    completed: { type: Boolean, default: false },
    dateCompleted: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("ServiceRecord", serviceRecordSchema);
