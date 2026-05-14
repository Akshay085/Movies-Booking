import nodemailer from "nodemailer";
import axios from "axios";

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

const sendEmail = async ({to , subject , body}) => {
    try {
        if (!process.env.SENDER_EMAIL || !process.env.SMTP_PASS) {
            throw new Error("Missing SENDER_EMAIL or SMTP_PASS environment variables");
        }

        const response = await transporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to,
            subject,
            html: body
        })
        return response;
    } catch (error) {
        console.error("SMTP Error:", error.message);
        
        // If SMTP fails, try Brevo's HTTP API (More reliable on Vercel)
        console.log("Attempting Brevo API Fallback...");
        try {
            const apiResponse = await axios.post('https://api.brevo.com/v3/smtp/email', {
                sender: { email: process.env.SENDER_EMAIL, name: "AVR Theater" },
                to: [{ email: to }],
                subject: subject,
                htmlContent: body
            }, {
                headers: {
                    'api-key': process.env.SMTP_PASS,
                    'Content-Type': 'application/json'
                }
            });
            console.log("Email sent successfully via Brevo API");
            return apiResponse.data;
        } catch (apiError) {
            const apiErrorMessage = apiError.response?.data?.message || apiError.message;
            const apiErrorCode = apiError.response?.data?.code || "unknown";
            
            console.error(`Brevo API Fallback failed: [${apiErrorCode}] ${apiErrorMessage}`);
            
            if (apiErrorMessage.includes("unauthorized") || apiErrorCode === "unauthorized") {
                console.error("CRITICAL: Your API Key (SMTP_PASS) seems invalid or unauthorized.");
            }
            
            throw new Error(`Email failed: SMTP (${error.message}) AND API (${apiErrorMessage})`);
        }
    }
}

export default sendEmail;