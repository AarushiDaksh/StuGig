import mongoose from "mongoose";

const RatingSchema = new mongoose.Schema(
  {
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: "UserClient", required: true },
    freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: "UserFreelancer", required: true },
    gigId: { type: mongoose.Schema.Types.ObjectId, ref: "Gig", required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    review: { type: String, maxlength: 500 },
  },
  { timestamps: true }
);

export default mongoose.models.Rating || mongoose.model("Rating", RatingSchema);
