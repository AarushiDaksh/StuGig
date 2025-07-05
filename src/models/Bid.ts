import mongoose from "mongoose";

const BidSchema = new mongoose.Schema({
  gigId: { type: mongoose.Schema.Types.ObjectId, ref: "Gig" },
  freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: "UserFreelancer" },
  bidAmount: Number,
  proposal: String,
});

export default mongoose.models.Bid || mongoose.model("Bid", BidSchema);