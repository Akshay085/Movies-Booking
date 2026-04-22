import mongoose from "mongoose";
import dns from "node:dns";

export const connectDB = async () => {
    // Set DNS servers to Google's public DNS to resolve SRV record issues
    dns.setServers(['8.8.8.8', '8.8.4.4']);
    
    try {
        await mongoose.connect(process.env.MONGODB_CONNECT);
        console.log("DB Connected");
    } catch (error) {
        console.log("DB Connection Error:", error);
    }
}