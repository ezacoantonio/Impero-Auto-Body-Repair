import mongoose from "mongoose";
import dotenv from "dotenv";
import Job from "./src/models/Job.js";

dotenv.config();

const clientId = process.argv[2]; // pass clientId from CLI
if (!clientId) {
  console.error("Usage: node seedJob.mjs <clientId>");
  process.exit(1);
}

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 8000,
    });
    const job = await Job.create({
      clientId,
      title: "Fender repaint",
      notes: "Match OEM color; minor dent",
      serviceRecommendations: [
        { name: "Repaint front-right fender", price: 380 },
      ],
      expenses: [{ item: "Paint & materials", cost: 58.25 }],
      workItems: [
        { description: "Mask & prep fender", progress: 100, done: true },
      ],
    });
    console.log("Seeded job:", job._id.toString());
  } catch (e) {
    console.error(e);
  } finally {
    await mongoose.disconnect();
  }
})();
