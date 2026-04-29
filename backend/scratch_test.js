import mongoose from "mongoose";
import showModel from "./models/showModel.js";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.MONGODB_CONNECT)
    .then(async () => {
        console.log("Connected to MongoDB");
        const shows = await showModel.find({});
        console.log("Total shows:", shows.length);
        if (shows.length > 0) {
            console.log("First show date:", shows[0].showDateTime);
        }
        
        const upcomingShows = await showModel.find({showDateTime: {$gte: new Date()}});
        console.log("Upcoming shows:", upcomingShows.length);

        mongoose.disconnect();
    })
    .catch(err => {
        console.error(err);
    });
