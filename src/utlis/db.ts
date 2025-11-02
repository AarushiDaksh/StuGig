import mongoose from "mongoose";

const connect = async () => {
  const mongoUrl = process.env.MONGO_URL;

  if (!mongoUrl) {
    throw new Error("MONGO_URL is not defined in environment variables");
  }

  if (mongoose.connections[0].readyState) return;

  try {
    await mongoose.connect(mongoUrl, {
      dbName: "Rolio-LinkedIN-Clone",
    });
    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw new Error("Error connecting to MongoDB");
  }
};

export default connect;
