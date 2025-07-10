import mongoose, { Schema, model, models } from "mongoose";

const ConversationSchema = new Schema({
  members: { type: [String], required: true },
}, { timestamps: true });

export default models.Conversation || model("Conversation", ConversationSchema);
