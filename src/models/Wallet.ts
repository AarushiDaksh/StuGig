import mongoose, { Schema, model, models } from "mongoose";

const WalletSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "UserClient", required: true },
    balance: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default models.Wallet || model("Wallet", WalletSchema);