import { Inngest } from "inngest";
import User from "../models/userModel.js";
import { connectDB } from "../configs/db.js";
import bookingModel from "../models/bookingModel.js";
import showModel from "../models/showModel.js";
import movieModel from "../models/movieModel.js";
import nodemailer from "nodemailer";

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

// Inngest function to send email when booking is successful
const sendBookingConfirmationEmail = inngest.createFunction(
    {
        id: "send-booking-confirmation-email",
        triggers: [{ event: "app/show.booked" }],
    },
    async ({ event, step }) => {
        await connectDB();
        const { bookingId } = event.data;

        const booking = await step.run("fetch-booking-details", async () => {
            return await bookingModel.findById(bookingId)
                .populate("user")
                .populate({
                    path: "show",
                    populate: { path: "movie" }
                });
        });

        if (!booking || !booking.user || !booking.show) {
            console.error("Booking, User or Show not found for ID:", bookingId);
            return;
        }

        await step.run("send-email", async () => {
            const transporter = nodemailer.createTransport({
                host: "smtp-relay.brevo.com",
                port: 587,
                secure: false, // STARTTLS
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });

            const showDateTime = new Date(booking.show.showDateTime);
            const formattedDate = showDateTime.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            });
            const formattedTime = showDateTime.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
            });

            const emailHtml = `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                    <div style="background-color: #e50914; padding: 20px; text-align: center; color: white;">
                        <h1 style="margin: 0; font-size: 24px;">Booking Confirmed!</h1>
                    </div>
                    <div style="padding: 20px;">
                        <p>Hi <strong>${booking.user.name}</strong>,</p>
                        <p>Your ticket booking is successful. Here are your booking details:</p>
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 8px 0; font-weight: bold; width: 120px;">Movie:</td>
                                <td style="padding: 8px 0;">${booking.show.movie.title}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-weight: bold;">Date:</td>
                                <td style="padding: 8px 0;">${formattedDate}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-weight: bold;">Time:</td>
                                <td style="padding: 8px 0;">${formattedTime}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-weight: bold;">Seats:</td>
                                <td style="padding: 8px 0;"><span style="font-family: monospace; font-size: 14px; background: #f4f4f4; padding: 4px 8px; border-radius: 4px;">${booking.bookedSeats.join(", ")}</span></td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-weight: bold;">Total Amount:</td>
                                <td style="padding: 8px 0; color: #e50914; font-weight: bold;">₹${booking.amount}</td>
                            </tr>
                        </table>
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                        <p style="font-size: 14px; color: #777; text-align: center; margin-top: 30px;">
                            Thank you for booking with AVR Theater!<br/>
                            Enjoy your movie!
                        </p>
                    </div>
                </div>
            `;

            const mailOptions = {
                from: `"AVR Theater" <${process.env.SENDER_EMAIL || "avrtheater@gmail.com"}>`,
                to: booking.user.email,
                subject: `Booking Confirmed - ${booking.show.movie.title}`,
                html: emailHtml,
            };

            await transporter.sendMail(mailOptions);
        });
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