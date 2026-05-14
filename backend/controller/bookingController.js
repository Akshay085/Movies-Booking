import { inngest } from "../inngest/index.js";
import bookingModel from "../models/bookingModel.js";
import showModel from "../models/showModel.js";
import Stripe from "stripe";


//Function to check availability of selected seats for a movie
const checkSeatsAvailability = async (showId, selectedSeats) => {
    try {
        const showData = await showModel.findById(showId)
        if(!showData) return false;

        const occupiedSeats = showData.occupiedSeats; 

        const isAnySeatTaken = selectedSeats.some( seat => occupiedSeats[seat]);

        return !isAnySeatTaken;
    } catch (error) {
        console.log(error.message);
        return false;
    }
}

const createBooking = async (req , res) => {
    try {
        const {userId} = req.auth();
        const {showId, selectedSeats} = req.body;
        const {origin} = req.headers;
        
        // check if the seat is available for the selected show
        const isAvailable = await checkSeatsAvailability(showId, selectedSeats);

        if(!isAvailable) {
            return res.json({success: false, message: "Selected seats are not available."}); 
        }

        // Get the show details
        const showData = await showModel.findById(showId).populate('movie');

        // Create a new Booking
        const booking = await bookingModel.create({
            user: userId,
            show: showId,
            amount: showData.showPrice * selectedSeats.length,
            bookedSeats: selectedSeats
        })

        selectedSeats.map((seat)=>{
            showData.occupiedSeats[seat] = userId;
        })

        showData.markModified('occupiedSeats');

        await showData.save();

        // Stripe Gateway Initialize
        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)

        // Create a PaymentIntent
        const paymentIntent = await stripeInstance.paymentIntents.create({
            amount: Math.floor(booking.amount * 100),
            currency: 'inr',
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                bookingId: booking._id.toString()
            }
        });

        // Store payment intent ID in paymentLink field for tracking
        booking.paymentLink = paymentIntent.id;
        await booking.save();

        // Run inngest to check payment status after 10 minutes of booking
        await inngest.send({
            name: "app/checkpayment",
            data: {
                bookingId: booking._id.toString()
            }
        })

        res.json({
            success: true, 
            clientSecret: paymentIntent.client_secret,
            bookingId: booking._id
        });

    } catch (error) {
        console.log(error.message);
        res.json({success: false , message: error.message})
    }
}

const getOccupiedSeats = async (req , res) => {
    try {
        const {showId} = req.params;
        const showData = await showModel.findById(showId);

        const occupiedSeats = Object.keys(showData.occupiedSeats);
        
        res.json({success: true , occupiedSeats})
    } catch (error) {
        console.log(error.message);
        res.json({success: false , message: error.message})
    }
}

const getBookingById = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const booking = await bookingModel.findById(bookingId).populate({
            path: "show",
            populate: {path: "movie"}
        });
        if(!booking) return res.json({success: false, message: "Booking not found"});

        let clientSecret = null;
        if (!booking.isPaid && booking.paymentLink && booking.paymentLink.startsWith('pi_')) {
            const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)
            const paymentIntent = await stripeInstance.paymentIntents.retrieve(booking.paymentLink);
            clientSecret = paymentIntent.client_secret;
        }

        res.json({success: true, booking, clientSecret});
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

const verifyPayments = async (req, res) => {
    try {
        const {userId} = req.auth();
        const unpaidBookings = await bookingModel.find({user: userId, isPaid: false});
        
        if(unpaidBookings.length > 0) {
            const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
            
            for (const booking of unpaidBookings) {
                if(booking.paymentLink) {
                    if (booking.paymentLink.startsWith('pi_')) {
                        try {
                            const paymentIntent = await stripeInstance.paymentIntents.retrieve(booking.paymentLink);
                            if (paymentIntent.status === 'succeeded') {
                                booking.isPaid = true;
                                booking.paymentLink = "";
                                await booking.save();
                                // Send Confirmation Email
                                await inngest.send({
                                    name: "app/show.booked",
                                    data: { bookingId: booking._id.toString() }
                                });
                            }
                        } catch(e) {
                            console.error("Failed to verify PI:", e.message);
                        }
                    } else {
                        // Backwards compatibility for old Checkout Sessions
                        const sessionIdMatch = booking.paymentLink.match(/cs_(test|live)_[a-zA-Z0-9]+/);
                        if (sessionIdMatch) {
                            try {
                                const session = await stripeInstance.checkout.sessions.retrieve(sessionIdMatch[0]);
                                if (session.payment_status === 'paid') {
                                    booking.isPaid = true;
                                    booking.paymentLink = "";
                                    await booking.save();
                                    // Send Confirmation Email
                                    await inngest.send({
                                        name: "app/show.booked",
                                        data: { bookingId: booking._id.toString() }
                                    });
                                }
                            } catch (e) {
                                console.error("Failed to verify session:", e.message);
                            }
                        }
                    }
                }
            }
        }
        res.json({success: true});
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

export {createBooking , getOccupiedSeats, getBookingById, verifyPayments};