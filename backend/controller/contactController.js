import { sendFeedbackEmail } from "../utils/emailHelper.js";

// API Controller function to handle feedback submissions
const submitContactForm = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validation
        if (!name || !email || !message) {
            return res.status(400).json({ 
                success: false, 
                message: "Please fill in all required fields (Name, Email, Message)." 
            });
        }

        const emailSent = await sendFeedbackEmail({ name, email, subject, message });

        if (emailSent) {
            return res.json({ 
                success: true, 
                message: "Your message has been sent successfully! We will get back to you soon." 
            });
        } else {
            return res.status(500).json({ 
                success: false, 
                message: "Unable to send email. Please try again later." 
            });
        }
    } catch (error) {
        console.error("Error in submitContactForm controller:", error);
        res.status(500).json({ 
            success: false, 
            message: "An internal server error occurred while sending your message." 
        });
    }
};

export { submitContactForm };
