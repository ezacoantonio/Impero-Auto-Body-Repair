import mongoose from "mongoose";

const ServiceRecommendationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    done: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["pending", "in_progress", "done"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const ExpenseSchema = new mongoose.Schema(
  {
    item: { type: String, required: true },
    cost: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

const WorkItemSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    recommendationId: { type: mongoose.Schema.Types.ObjectId },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    done: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const VehicleSchema = new mongoose.Schema(
  {
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true, min: 1900 },
  },
  { _id: false }
);

const ClientSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    plateNumber: { type: String, required: true, unique: true, index: true },
    vehicle: { type: VehicleSchema, required: true },
    serviceRecommendations: {
      type: [ServiceRecommendationSchema],
      default: [],
    },
    expenses: { type: [ExpenseSchema], default: [] },
    workItems: { type: [WorkItemSchema], default: [] },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// ✅ NEW: virtual relation to Jobs collection
ClientSchema.virtual("jobs", {
  ref: "Job",
  localField: "_id",
  foreignField: "clientId",
  justOne: false,
});
// keep status aligned
ClientSchema.pre("save", function (next) {
  this.serviceRecommendations.forEach((rec) => {
    rec.status = rec.done
      ? "done"
      : rec.progress > 0
      ? "in_progress"
      : "pending";
    if (rec.done && rec.progress < 100) rec.progress = 100;
    if (!rec.done && rec.progress === 100) rec.done = true;
  });
  next();
});

export default mongoose.model("Client", ClientSchema);
