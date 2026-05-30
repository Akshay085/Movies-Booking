const protectAdmin = async (req , res , next) => {
    try {
        const { token } = req.headers;
        if (token === "avr-admin-token-xyz") {
            next();
        } else {
            return res.json({success: false, message: "Not Authorized"});
        }
    } catch (error) {
        return res.json({success: false, message: "Not Authorized"});
    }
}

export default protectAdmin;