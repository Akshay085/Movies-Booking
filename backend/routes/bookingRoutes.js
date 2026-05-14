import express from 'express';
import { createBooking, getOccupiedSeats, verifyPayments, getBookingById } from '../controller/bookingController.js';

const bookingRouter = express.Router();

bookingRouter.post('/create', createBooking);
bookingRouter.get('/seat/:showId', getOccupiedSeats);
bookingRouter.post('/verify', verifyPayments);
bookingRouter.get('/:bookingId', getBookingById);

export default bookingRouter;