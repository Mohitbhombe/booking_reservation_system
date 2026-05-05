import mongoose from "mongoose";
import { env } from "./env";

export const connectDB = async (): Promise<void> => {
  if (!env.mongoUri) {
    throw new Error("MONGO_URI is missing in environment variables");
  }

  await mongoose.connect(env.mongoUri);
  // eslint-disable-next-line no-console
  console.log("MongoDB connected");
};
