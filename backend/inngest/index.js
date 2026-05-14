import { Inngest } from "inngest";
import User from "../models/userModel.js";
import { connectDB } from "../configs/db.js";
import bookingModel from "../models/bookingModel.js";
import showModel from "../models/showModel.js";
import sendEmail from "../configs/nodeMailer.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "movie-ticket-booking" });

const syncUserCreation = inngest.createFunction(
    { 
        id: 'sync-user-from-clerk',
        triggers: [{ event: 'clerk/user.created' }]
    },
    async ({ event }) => {
        await connectDB();
        console.log("Webhook Received:", event.data);
        const payload = event.data.data || event.data;
        const { id, first_name, last_name, email_addresses, image_url } = payload;
        const userData = {
            _id: id,
            email: email_addresses && email_addresses.length > 0 ? email_addresses[0].email_address : "",
            name: first_name + (last_name ? ' ' + last_name : ''),
            image: image_url || ""
        }
        await User.create(userData);
    }
)

//Inngest Function to delete from database

const syncUserDeletion = inngest.createFunction(
    { 
        id: 'delete-user-with-clerk',
        triggers: [{ event: 'clerk/user.deleted' }]
    },
    async ({ event }) => {
        await connectDB();
        console.log("Delete Webhook Received:", event.data);
        const payload = event.data.data || event.data;
        const { id } = payload;
        await User.findByIdAndDelete(id);
    }
)

//Inngest Function to update data in database

const syncUserUpdation = inngest.createFunction(
    { 
        id: 'update-user-from-clerk',
        triggers: [{ event: 'clerk/user.updated' }]
    },
    async ({ event }) => {
        await connectDB();
        console.log("Update Webhook Received:", event.data);
        const payload = event.data.data || event.data;
        const { id, first_name, last_name, email_addresses, image_url } = payload;
        const userData = {
            _id: id,
            email: email_addresses && email_addresses.length > 0 ? email_addresses[0].email_address : "",
            name: first_name + (last_name ? ' ' + last_name : ''),
            image: image_url || ""
        }
        await User.findByIdAndUpdate(id, userData);
    }
)

// Ingest function to cancel booking and release seats of show after 10 minutes of booking if payment is not made

const relaseSeatsAndDeleteBooking = inngest.createFunction(
    {
        id: "release-seats-delete-booking",
        triggers: [{ event: "app/checkpayment" }],
    },
    async ({event , step}) => {
        const tenMinuteLater = new Date(Date.now() + 10 * 60 * 1000);
        await step.sleepUntil('wait-for-10-minutes',tenMinuteLater);

        await step.run('check-payment-status', async () => {
            const bookingId = event.data.bookingId;
            const booking = await bookingModel.findById(bookingId);

            //If booking is not made, release the seats and delete booking
            if(!booking.isPaid){
                const show = await showModel.findById(booking.show);
                booking.bookedSeats.forEach((seat) => {
                    delete show.occupiedSeats[seat];
                });
                show.markModified('occupiedSeats')
                await show.save();
                await bookingModel.findByIdAndDelete(booking._id);
            }
        })
    }
)

// Ingest function to send email when user books a show
const sendBookingConfirmationEmail = inngest.createFunction(
    {
        id: "send-booking-confirmation-email",
        triggers: [{ event: "app/show.booked" }],
    },
   async ({event , step}) => {
        await connectDB();
        const { bookingId } = event.data;
        const booking = await bookingModel.findById(bookingId).populate({
            path: 'show',
            populate: { path: "movie", model: "Movie" }
        }).populate('user');

        if (!booking || !booking.user) {
            console.error("Booking or User not found for ID:", bookingId);
            return;
        }

        await sendEmail({
            to: booking.user.email,
            subject: `Payment Confirmation: "${booking.show.movie.title}" booked!`,
            body: ` <div style="font-family: Arial, sans-serif; line-height: 1.5;">
                        <h2>Hi ${booking.user.name},</h2>
                        <p>Your booking for <strong style="color: #F84565;">"${booking.show.movie.title}"</strong> 
                        is confirmed!</p>
                        <p>
                            <strong>Date:</strong> ${new Date(booking.show.showDateTime)
                                .toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata'})} <br/>
                            <strong>Time:</strong> ${new Date(booking.show.showDateTime)
                                .toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata'})} <br/>
                        </p>
                        <p>Enjoy the show! 🎬🍿</p>
                        <p>Thank you for booking with us!<br/>-- AVR Theater Team</p>
                    </div>`
        })
   }
)

// Create an empty array where we'll export future Inngest functions
export const functions = [
    syncUserCreation, 
    syncUserDeletion,
    syncUserUpdation,
    relaseSeatsAndDeleteBooking,
    sendBookingConfirmationEmail
];