import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
  throw new Error("Missing MONGODB_URI in environment");
}

let isConnected = false;

export default async function connectToDatabase() {
  if (isConnected) return mongoose;
  await mongoose.connect(MONGODB_URI);
  isConnected = true;
  return mongoose;
}