import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "stugigUsersFreelancer", 

  }
);

//"UserStugig" as the model name
export default mongoose.models.UserStugig || mongoose.model("UserStugig", userSchema);

