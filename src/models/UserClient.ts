import mongoose from "mongoose";
const { Schema } = mongoose;

const clientSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, default: "client" },
  },
  {
    timestamps: true,
    collection: "stugigUsersClient",
  }
);

export default mongoose.models.UserClient ||
  mongoose.model("UserClient", clientSchema);
