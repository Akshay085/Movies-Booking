import mongoose from "mongoose";
import dns from "node:dns";

export const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) {
        return;
    }

    // Disable buffering so we get immediate errors if not connected instead of operations hanging
    mongoose.set('bufferCommands', false);

    try {
        // Try to set DNS servers locally
        dns.setServers(['8.8.8.8', '8.8.4.4']);
    } catch (error) {
        console.log("Could not set DNS servers:", error.message);
    }
    
    try {
        await mongoose.connect(process.env.MONGODB_CONNECT, {
            serverSelectionTimeoutMS: 5000 // Timeout fast on serverless
        });
        console.log("DB Connected");
    } catch (error) {
        console.log("DB Connection Error:", error);
        throw error; // Throw error so middleware can catch it
    }
}