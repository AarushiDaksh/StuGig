import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema(
  {
    members: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);

ConversationSchema.index({ members: 1 }, { unique: true });
export default mongoose.models.Conversation || mongoose.model("Conversation", ConversationSchema);
