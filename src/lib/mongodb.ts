import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { connection: null, promise: null };
}

export async function connectDB() {
  if (cached.connection) return cached.connection;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
  }
  cached.connection = await cached.promise;
  return cached.connection;
}
