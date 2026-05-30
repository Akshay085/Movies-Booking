import Stripe from "stripe";
import bookingModel from "../models/bookingModel.js";
import { inngest } from "../inngest/index.js";

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
                await bookingModel.findByIdAndUpdate(bookingId, {
                    isPaid: true,
                    paymentLink: ""
                });
            }
        }
        
        if (event.type === "payment_intent.succeeded") {
            const paymentIntent = event.data.object;
            if (paymentIntent.metadata && paymentIntent.metadata.bookingId) {
                bookingId = paymentIntent.metadata.bookingId;
                await bookingModel.findByIdAndUpdate(bookingId, {
                    isPaid: true,
                    paymentLink: ""
                });
            }
        }

        res.status(200).json({ received: true });

    } catch (error) {
        console.error('Webhook processing error:', error);    
        res.status(500).send(`Internal Server Error: ${error.message}`);
    }
}

export default stripeWebhooks;