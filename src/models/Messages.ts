import mongoose, { Schema, model, models } from "mongoose";

const MessageSchema = new Schema({
  conversationId: { type: Schema.Types.ObjectId, ref: "Conversation", required: true },
  sender: { type: String, required: true },
  text: { type: String, required: true },
}, { timestamps: true });

export default models.Message || model("Message", MessageSchema);
