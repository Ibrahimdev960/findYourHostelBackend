const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const protect = async (req, res, next) => {
    try {
        console.log("Request Headers:", req.headers); // 🛑 Debugging Log

        let token = req.headers.authorization;
        if (!token || !token.startsWith("Bearer")) {
            console.log("❌ Token Missing or Invalid Format"); // Debugging Log
            return res.status(401).json({ message: "No token provided or invalid format" });
        }

        token = token.split(" ")[1];
        console.log("✅ Extracted Token:", token); // Debugging Log

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Decoded Token:", decoded); // Debugging Log

        if (!decoded || !decoded.id) {
            console.log("❌ Invalid Token Structure"); // Debugging Log
            return res.status(401).json({ message: "Invalid token structure" });
        }

        req.user = await User.findById(decoded.id).select("-password");
        if (!req.user) {
            console.log("❌ User Not Found in Database"); // Debugging Log
            return res.status(401).json({ message: "User not found" });
        }

        console.log("✅ Authorized User:", req.user); // Debugging Log
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error.message); // Debugging Log
        return res.status(401).json({ message: "Not authorized, token failed", error: error.message });
    }
};

const isHostelOwner = (req, res, next) => {
    if (!req.user || !req.user.role) {
        return res.status(403).json({ message: 'Access denied, user role not found' });
    }
    
    console.log("User Role:", req.user.role); // Debugging Line
    
    if (req.user.role.toLowerCase() === 'hostelowner' || req.user.role.toLowerCase() === 'hosteller') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied, not a hostel owner' });
    }
};

module.exports = { protect, isHostelOwner };
