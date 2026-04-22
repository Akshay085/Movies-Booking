import mongoose from "mongoose";
import dns from "node:dns";

export const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) {
        return;
    }

    try {
        // Try to set DNS servers to Google's public DNS to resolve SRV record issues locally
        dns.setServers(['8.8.8.8', '8.8.4.4']);
    } catch (error) {
        console.log("Could not set DNS servers:", error.message);
    }
    
    try {
        await mongoose.connect(process.env.MONGODB_CONNECT);
        console.log("DB Connected");
    } catch (error) {
        console.log("DB Connection Error:", error);
    }
}