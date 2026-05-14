import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // Use TLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    // This helps in serverless environments where the IP might be blocked or certificate mismatches occur
    rejectUnauthorized: false
  }
});

import axios from "axios";

const sendEmail = async ({to , subject , body}) => {
    try {
        const response = await transporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to,
            subject,
            html: body
        })
        return response;
    } catch (error) {
        console.error("SMTP Error, trying API fallback:", error.message);
        
        // If SMTP fails, try Brevo's HTTP API (More reliable on Vercel)
        try {
            const apiResponse = await axios.post('https://api.brevo.com/v3/smtp/email', {
                sender: { email: process.env.SENDER_EMAIL, name: "AVR Theater" },
                to: [{ email: to }],
                subject: subject,
                htmlContent: body
            }, {
                headers: {
                    'api-key': process.env.SMTP_PASS, // Brevo SMTP Pass is usually the API Key
                    'Content-Type': 'application/json'
                }
            });
            return apiResponse.data;
        } catch (apiError) {
            console.error("Brevo API Fallback also failed:", apiError.response?.data || apiError.message);
            throw error; // Throw the original SMTP error if both fail
        }
    }
}

export default sendEmail;