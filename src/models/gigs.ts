import mongoose from "mongoose";
import "@/models/UserClient";
import "@/models/UserFreelancer";

const GigSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    budget: { type: Number, required: true },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserClient",
      required: true,
    },
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserFreelancer",
      required: false,
      default: null,
    },
    category: String,
    skills: {
      type: [String],
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);


export default mongoose.models.Gig || mongoose.model("Gig", GigSchema, "gigs");
