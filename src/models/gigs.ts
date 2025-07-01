import mongoose from "mongoose";
import "@/models/UserFreelancer";

const GigSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    budget: Number,
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserStugig", 
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Gig || mongoose.model("Gig", GigSchema);
