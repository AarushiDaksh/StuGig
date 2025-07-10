import mongoose from "mongoose";

const BidSchema = new mongoose.Schema(
  {
    gigId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gig",
      required: true,
    },
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserFreelancer",
      required: true,
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserClient",
      required: true,
    },
    proposal: {
      type: String,
      default: "",
    },
    amount: {
      type: Number,
      required: true,
    },
      status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
      },
                isAccepted: {
        type: Boolean,
        default: false,
      }

  },
  { timestamps: true }
);

export default mongoose.models.Bid || mongoose.model("Bid", BidSchema);
