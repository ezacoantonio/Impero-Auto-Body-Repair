const mongoose = require("mongoose");

const serviceReportSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    services: [
      {
        name: String,
        type: { type: String, enum: ["body", "mechanic"] },
        price: Number,
        notes: String,
      },
    ],
    items: [
      {
        name: String,
        condition: String,
        notes: String,
      },
    ],
    parts: [
      {
        name: String,
        price: Number,
        quantity: Number,
      },
    ],
    status: { type: String, enum: ["draft", "completed"], default: "draft" },
    createdAt: { type: Date, default: Date.now },
    completedAt: Date,
    lastSaved: Date,
  },
  { versionKey: false }
);

module.exports = mongoose.model("ServiceReport", serviceReportSchema);
