// models/SwapIntent.ts
import mongoose from "mongoose";

const SwapIntentSchema = new mongoose.Schema({
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "UserFreelancer", required: true },
  toUser: { type: mongoose.Schema.Types.ObjectId, ref: "UserFreelancer", required: true },
  direction: { type: String, enum: ["left", "right"], required: true }
}, { timestamps: true });

export default mongoose.models.SwapIntent || mongoose.model("SwapIntent", SwapIntentSchema);
