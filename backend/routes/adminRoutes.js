import express from 'express';
import protectAdmin from '../middleware/auth.js';
import { getAllBookings, getAllShows, getDashboardData, isAdmin, adminLogin } from '../controller/adminController.js';

const adminRouter = express.Router();

adminRouter.post('/login', adminLogin)

adminRouter.get('/dashboard', protectAdmin, getDashboardData)
adminRouter.get('/all-shows', protectAdmin, getAllShows)
adminRouter.get('/all-bookings', protectAdmin, getAllBookings)

export default adminRouter;