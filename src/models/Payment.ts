// models/Payment.ts
import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  hiringId: { type: mongoose.Schema.Types.ObjectId, ref: "Hiring" },
  amount: Number,
  paidAt: Date,
});

export default mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);
