import mongoose from "mongoose";

export async function connectDB(): Promise<void> {
    try {
        await mongoose.connect(process.env.MONGODB_URL as string);
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
}
