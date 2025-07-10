import mongoose from "mongoose";

const CommissionSchema = new mongoose.Schema({
  gigId: { type: mongoose.Schema.Types.ObjectId, ref: "Gig" },
  amount: Number,
  platformEarning: Number,
  date: { type: Date, default: Date.now },
});

export default mongoose.models.Conversation || mongoose.model("Commissions", CommissionSchema);