import mongoose from "mongoose";

const { Schema } = mongoose;

enum Role {
  CLIENT = "client",
  FREELANCER = "freelancer",
}

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
    role: {
      type: String,
      enum: Role,
      required: true,
    },
  },
  {
    timestamps: true,
<<<<<<< HEAD:src/models/User.ts
    collection: "stugigUsers",
=======
    collection: "stugigUsersFreelancer", 
>>>>>>> 90c8d80 (n):src/models/UserFreelancer.ts
  }
);

//"UserStugig" as the model name
<<<<<<< HEAD:src/models/User.ts
export default mongoose.models.UserStugig ||
  mongoose.model("UserStugig", userSchema);
=======
export default mongoose.models.UserStugig || mongoose.model("UserStugig", userSchema);
>>>>>>> 90c8d80 (n):src/models/UserFreelancer.ts
