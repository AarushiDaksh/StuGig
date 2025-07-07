import mongoose from "mongoose";
const { Schema } = mongoose;

const freelancerSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "freelancer" },

    firstName: String,
    lastName: String,
    profilePicture: String,
    bio: { type: String, maxlength: 500 },

    skills: [String],
    expertise: [String],

    portfolio: [
      {
        title: String,
        description: String,
        link: String,
        image: String,
      },
    ],

    hourlyRate: { type: Number, min: 0 },
    availability: {
      isAvailable: { type: Boolean, default: true },
      workingHours: {
        start: String,
        end: String,
      },
    },

    isProfileComplete: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: "stugigUsersFreelancer",
  }
);

export default mongoose.models.UserFreelancer ||
  mongoose.model("UserFreelancer", freelancerSchema);
