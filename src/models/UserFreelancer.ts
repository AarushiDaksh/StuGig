import mongoose from "mongoose";

const { Schema } = mongoose;

const freelancerSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // Profile Information
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    profilePicture: { type: String, required: false },
    bio: { type: String, required: false, maxlength: 500 },

    // Skills and Expertise
    skills: [{ type: String, required: false }],
    expertise: [{ type: String, required: false }],

    // Portfolio
    portfolio: [
      {
        title: { type: String, required: false },
        description: { type: String, required: false },
        link: { type: String, required: false },
        image: { type: String, required: false },
      },
    ],

    // Availability and Rates
    hourlyRate: { type: Number, required: false, min: 0 },
    availability: {
      isAvailable: { type: Boolean, default: true },
      workingHours: {
        start: { type: String, required: false },
        end: { type: String, required: false },
      },
    },

    // Profile Status
    isProfileComplete: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: "stugigUsersFreelancer",
  }
);

export default mongoose.models.UserFreelancer ||
  mongoose.model("UserFreelancer", freelancerSchema);