// models/SkillSwapProfile.ts
import mongoose from "mongoose";

const SkillSwapProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "UserFreelancer", required: true, unique: true },
  name: String,
  avatar: String,
  offeredSkill: { type: String, required: true },
  requiredSkill: { type: String, required: true },
  description: String,
  portfolioUrl: String,
  available: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.SkillSwapProfile || mongoose.model("SkillSwapProfile", SkillSwapProfileSchema);
