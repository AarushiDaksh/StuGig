import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    razorpayPaymentId: { type: String, required: true },
    amount: Number,
    currency: String,
    status: String,
    gig: { type: mongoose.Schema.Types.ObjectId, ref: "Gig" },
    client: { type: mongoose.Schema.Types.ObjectId, ref: "UserClient" },
    freelancer: { type: mongoose.Schema.Types.ObjectId, ref: "UserFreelancer" },
  },
  { timestamps: true }
);

export default mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);
