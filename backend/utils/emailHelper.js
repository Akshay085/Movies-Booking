import nodemailer from "nodemailer";
import bookingModel from "../models/bookingModel.js";
import userModel from "../models/userModel.js";
import showModel from "../models/showModel.js";
import movieModel from "../models/movieModel.js";
import { connectDB } from "../configs/db.js";

export const sendBookingConfirmationEmail = async (bookingId) => {
    try {
        await connectDB();
        
        const booking = await bookingModel.findById(bookingId)
            .populate("user")
            .populate({
                path: "show",
                populate: { path: "movie" }
            });

        if (!booking || !booking.user || !booking.show) {
            console.error("Booking, User or Show not found for ID:", bookingId);
            return false;
        }

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // STARTTLS
            auth: {
                user: process.env.SENDER_EMAIL,
                pass: process.env.SENDER_PASSWORD,
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

        const info = await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error("Failed to send booking confirmation email:", error);
        return false;
    }
};
