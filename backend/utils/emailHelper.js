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

export const sendFeedbackEmail = async ({ name, email, subject, message }) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // STARTTLS
            auth: {
                user: process.env.SENDER_EMAIL,
                pass: process.env.SENDER_PASSWORD,
            },
        });

        const emailHtml = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                <div style="background-color: #2563eb; padding: 20px; text-align: center; color: white;">
                    <h1 style="margin: 0; font-size: 24px; font-weight: bold;">New Feedback / Query</h1>
                </div>
                <div style="padding: 24px; background-color: #ffffff;">
                    <p style="margin-top: 0; font-size: 16px; color: #555;">You have received a new submission from the AVR Theater contact form:</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                        <tr>
                            <td style="padding: 8px 0; font-weight: bold; width: 100px; color: #666; vertical-align: top;">Name:</td>
                            <td style="padding: 8px 0; color: #111; vertical-align: top;">${name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; font-weight: bold; color: #666; vertical-align: top;">Email:</td>
                            <td style="padding: 8px 0; color: #111; vertical-align: top;"><a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a></td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; font-weight: bold; color: #666; vertical-align: top;">Subject:</td>
                            <td style="padding: 8px 0; color: #111; vertical-align: top; font-weight: 600;">${subject || "No Subject Provided"}</td>
                        </tr>
                        <tr>
                            <td style="padding: 12px 0 8px 0; font-weight: bold; color: #666; vertical-align: top;" colspan="2">Message:</td>
                        </tr>
                        <tr>
                            <td style="padding: 12px; color: #333; background-color: #f9fafb; border-radius: 6px; border: 1px solid #f3f4f6; white-space: pre-wrap; font-family: inherit; line-height: 1.5;" colspan="2">${message}</td>
                        </tr>
                    </table>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 24px 0 20px 0;" />
                    <p style="font-size: 12px; color: #9ca3af; text-align: center; margin-bottom: 0;">
                        This email was sent automatically from the AVR Theater web portal.
                    </p>
                </div>
            </div>
        `;

        const mailOptions = {
            from: `"AVR Theater Contact Form" <${process.env.SENDER_EMAIL}>`,
            to: process.env.SENDER_EMAIL,
            replyTo: email,
            subject: `Contact Form: ${subject || 'New Feedback'}`,
            html: emailHtml,
        };

        const info = await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error("Failed to send feedback email:", error);
        return false;
    }
};
