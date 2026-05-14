import 'dotenv/config';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function test() {
  try {
    const payload = JSON.stringify({
      id: 'evt_test_webhook',
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_test_webhook',
          payment_status: 'paid',
          metadata: {
            bookingId: 'test_booking_id'
          }
        }
      }
    });

    const signature = stripe.webhooks.generateTestHeaderString({
      payload,
      secret: process.env.STRIPE_WEBHOOK_SECRET
    });

    console.log("Sending webhook request to http://localhost:3000/api/stripe...");
    
    const response = await fetch('http://localhost:3000/api/stripe', {
      method: 'POST',
      headers: {
        'stripe-signature': signature,
        'Content-Type': 'application/json'
      },
      body: payload
    });

    const text = await response.text();
    console.log(`Response Status: ${response.status}`);
    console.log(`Response Body: ${text}`);

  } catch (error) {
    console.error("Test script error:", error);
  }
}

test();
