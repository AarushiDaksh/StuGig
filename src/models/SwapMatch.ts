import mongoose from "mongoose";

// models/SwapMatch.ts
const SwapMatchSchema = new mongoose.Schema({
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "UserFreelancer" }],
  matchedAt: { type: Date, default: Date.now }
});

export default mongoose.models.SwapMatch || mongoose.model("SwapMatch", SwapMatchSchema);
