import mongoose, { Schema, models, model, Types } from "mongoose";

const CommentSchema = new Schema(
  {
    author: { type: Types.ObjectId, ref: "User", required: true },
    text:   { type: String, required: true },
  },
  { timestamps: true }
);

const PostSchema = new Schema(
  {
    author:  { type: Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    image:   { type: String, default: "" }, // optional post image
    likes:   [{ type: Types.ObjectId, ref: "User" }],
    comments:[CommentSchema],
  },
  { timestamps: true, collection: "posts-rolio" }
);

export default models.Post || model("Post", PostSchema);
