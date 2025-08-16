// server/src/models/Job.js
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

const JobSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
      index: true,
    },
    title: { type: String, required: true },
    status: {
      type: String,
      enum: ["open", "in_progress", "done", "invoiced"],
      default: "open",
      index: true,
    },
    openedAt: { type: Date, default: () => new Date() },
    closedAt: { type: Date },
    notes: { type: String },
    serviceRecommendations: {
      type: [ServiceRecommendationSchema],
      default: [],
    },
    expenses: { type: [ExpenseSchema], default: [] },
    workItems: { type: [WorkItemSchema], default: [] },
    invoiceNumber: { type: String },
    invoicedAt: { type: Date },
  },
  { timestamps: true }
);

JobSchema.pre("save", function (next) {
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

// The model name MUST be exactly "Job" to match ref: "Job"
export const Job = mongoose.model("Job", JobSchema);
export default Job;
