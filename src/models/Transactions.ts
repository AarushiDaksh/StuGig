import mongoose, { Schema, model, models } from "mongoose";

const TransactionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "UserClient", required: true },
    amount: { type: Number, required: true },
    description: { type: String },
    type: { type: String, enum: ["credit", "debit"], required: true },
  },
  { timestamps: true }
);

export default models.Transaction || model("Transaction", TransactionSchema);
