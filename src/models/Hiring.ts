import mongoose from "mongoose";

const HiringSchema = new mongoose.Schema({
  gigId: { type: mongoose.Schema.Types.ObjectId, ref: "Gig" },
  freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: "UserFreelancer" },
  hireDate: Date,
});

export default mongoose.models.Hiring || mongoose.model("Hiring", HiringSchema);