import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, {
  timestamps: true,
  collection: "stugigUsersFreelancer", 
});

export default mongoose.models.UserStugig || mongoose.model("UserStugig", userSchema);
