
// models/Conversation.ts
import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema(
  {
    participants: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserClient",
    }],
  },
  { timestamps: true }
);

export default mongoose.models.Conversation || mongoose.model("Conversation", ConversationSchema);
