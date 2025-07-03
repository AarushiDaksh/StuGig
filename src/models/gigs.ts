import mongoose from "mongoose";
import "@/models/UserFreelancer"; // ensures model is registered

const GigSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    budget: Number,
    freelancerId: {
      //type: mongoose.Schema.Types.ObjectId,
      type: String,
      ref: "UserStugig",
      required: true,
    },
    category: String,
    skills: [String],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Gig || mongoose.model("Gig", GigSchema, "gigs");