import Stripe from "stripe";
import bookingModel from "../models/bookingModel.js";
import { sendBookingConfirmationEmail } from "../utils/emailHelper.js";

const stripeWebhooks = async (req ,res) => {
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
    const sig = req.headers["stripe-signature"];

    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(req.body , sig, process.env.STRIPE_WEBHOOK_SECRET);
        console.log("Stripe Webhook Received:", event.type);
    } catch (error) {
        console.error(`Webhook Signature Error: ${error.message}`);
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    try {
        let bookingId;

        if (event.type === "checkout.session.completed") {
            const session = event.data.object;
            if (session.payment_status === "paid") {
                bookingId = session.metadata.bookingId;
                const booking = await bookingModel.findById(bookingId);
                if (booking && !booking.isPaid) {
                    booking.isPaid = true;
                    booking.paymentLink = "";
                    await booking.save();
                    
                    // Send Confirmation Email
                    sendBookingConfirmationEmail(bookingId.toString()).catch(err => console.error(err));
                }
            }
        }
        
        if (event.type === "payment_intent.succeeded") {
            const paymentIntent = event.data.object;
            if (paymentIntent.metadata && paymentIntent.metadata.bookingId) {
                bookingId = paymentIntent.metadata.bookingId;
                const booking = await bookingModel.findById(bookingId);
                if (booking && !booking.isPaid) {
                    booking.isPaid = true;
                    booking.paymentLink = "";
                    await booking.save();
                    
                    // Send Confirmation Email
                    sendBookingConfirmationEmail(bookingId.toString()).catch(err => console.error(err));
                }
            }
        }

        res.status(200).json({ received: true });

    } catch (error) {
        console.error('Webhook processing error:', error);    
        res.status(500).send(`Internal Server Error: ${error.message}`);
    }
}

export default stripeWebhooks;