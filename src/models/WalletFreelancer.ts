import mongoose, { Schema, model, models } from "mongoose";

const WalletFreelancerSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "UserFreelancer", required: true },
    balance: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default models.WalletFreelancer || model("WalletFreelancer", WalletFreelancerSchema);
