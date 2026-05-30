import bookingModel from "../models/bookingModel.js"
import showModel from "../models/showModel.js";
import userModel from "../models/userModel.js";


// API to check if user is admin
const isAdmin = async (req , res) => {
    res.json({success: true , isAdmin: true})
}

// API to get dashboard data 
const getDashboardData = async (req , res) => {
    try {
        const bookings = await bookingModel.find({});
        const activeShows = await showModel.find({showDateTime: {$gte: new Date()}}).populate('movie').sort({ showDateTime: 1 });

        const totalUser = await userModel.countDocuments();

        const dashboardData = {
            totalBookings: bookings.length,
            totalRevenue: bookings.filter(item => item.isPaid).reduce((acc, booking) => acc + booking.amount, 0),
            activeShows,
            totalUser,
        }

        res.json({success: true , dashboardData})
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message }); 
    }
}

// API to get all Shows

const getAllShows = async (req , res) => {
    try {
        const shows = await showModel.find({showDateTime: { $gte: new Date() }}).populate('movie').sort({ showDateTime: 1 });
        res.json({success: true , shows})
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message }); 
    }
}

// API to get all Bookings
const getAllBookings = async (req , res) => {
    try {
        const bookings = await bookingModel.find({}).populate('user').populate({
            path: "show",
            populate: {path: "movie"}
        }).sort({ createdAt: -1 });
        res.json({success: true , bookings}) 
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

// API for admin login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (email === "avrtheater@gmail.com" && password === process.env.ADMIN_PASSWORD) {
            res.json({ success: true, token: "avr-admin-token-xyz" });
        } else {
            res.json({ success: false, message: "Invalid email or password" });
        }
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

export { isAdmin, getDashboardData, getAllShows, getAllBookings, adminLogin };