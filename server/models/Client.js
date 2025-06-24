const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
  {
    plateNumber: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    vehicleImage: { type: String },
    status: {
      type: String,
      enum: ["active", "completed", "archived"],
      default: "active",
    },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtuals for related data
clientSchema.virtual("services", {
  ref: "ServiceRecord",
  localField: "_id",
  foreignField: "clientId",
});

clientSchema.virtual("items", {
  ref: "VehicleItem",
  localField: "_id",
  foreignField: "clientId",
});

clientSchema.virtual("parts", {
  ref: "Part",
  localField: "_id",
  foreignField: "clientId",
});

module.exports = mongoose.model("Client", clientSchema);
