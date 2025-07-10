import mongoose, { Schema, model, models } from "mongoose";

const TransactionFreelancerSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "UserFreelancer", required: true },
    amount: { type: Number, required: true },
    description: { type: String },
    type: { type: String, enum: ["credit", "debit"], required: true },
  },
  { timestamps: true }
);

export default models.TransactionFreelancer || model("TransactionFreelancer", TransactionFreelancerSchema);
