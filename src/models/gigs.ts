import mongoose from "mongoose";

const GigSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  budget: { type: Number, required: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "UserClient", required: true },
  freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: "UserFreelancer", default: null },
  deadline: { type: Date },
  isCompleted: { type: Boolean, default: false },
  status: {
      type: String,
      enum: ["open", "ongoing", "completed"],
      default: "open",
    },
  skills: {
  type: [String],
  default: [], 
}

}, { timestamps: true });

export default mongoose.models.Gig || mongoose.model("Gig", GigSchema);