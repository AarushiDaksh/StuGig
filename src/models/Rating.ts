import mongoose from "mongoose";

const RatingSchema = new mongoose.Schema({
  freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: "UserFreelancer" },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "UserClient" },
  gigId: { type: mongoose.Schema.Types.ObjectId, ref: "Gig" },
  rating: Number,
  feedback: String,
});

export default mongoose.models.Rating || mongoose.model("Rating", RatingSchema);
