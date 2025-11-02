import mongoose, { Schema, models, model } from "mongoose";

const UserSchema = new Schema(
  {
    username: { type: String, required: true },
    email:    { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role:     { type: String, default: "user" },
    image:    { type: String, default: "" }, // <- avatar url (optional)
    bio:      { type: String, default: "" },
  },
  { timestamps: true, collection: "users-rolio" }
);

export default models.User || model("User", UserSchema);
