const Booking = require('../models/bookingModel');
const Hostel = require('../models/hostelModel');
const { sendNotification } = require('../controllers/notificationController'); // Import Notification

// ✅ Book a Hostel
const bookHostel = async (req, res) => {
    try {
        const { hostelId, userId, checkInDate, checkOutDate, paymentStatus } = req.body;

        console.log("Received Booking Data:", req.body); // Debugging Line

        // ✅ Check if hostelId exists
        if (!hostelId) {
            return res.status(400).json({ message: "hostelId is required" });
        }

        // ✅ Find hostel in DB
        const hostel = await Hostel.findById(hostelId);
        if (!hostel) {
            return res.status(404).json({ message: "Hostel not found" });
        }

        console.log("Found Hostel:", hostel); // Debugging Line

        // ✅ Create booking
        const newBooking = new Booking({
            hostelId,
            userId,
            checkInDate,
            checkOutDate,
            paymentStatus
        });

        await newBooking.save();

        // ✅ Send Notification to User
        sendNotification(userId, `Your booking for ${hostel.name} is confirmed!`, 'Booking');

        // ✅ Send Notification to Admin
        sendNotification(hostel.ownerId, `New booking for ${hostel.name} by User ID: ${userId}`, 'Admin');

        res.status(201).json({ message: "Booking successful", booking: newBooking });

    } catch (error) {
        console.error("Booking Error:", error.message);
        res.status(500).json({ message: "Error booking hostel", error: error.message });
    }
};

// ✅ Cancel Booking
const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params; // Booking ID
        const { userId } = req.body; // User ID from request body

        console.log("Received Booking Cancel Request:", { id, userId });

        // ✅ Check if bookingId exists
        if (!id) {
            return res.status(400).json({ message: "Booking ID is required" });
        }

        // ✅ Find booking in DB
        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        console.log("Found Booking:", booking);

        // ✅ Check if user is authorized to cancel the booking
        if (booking.userId.toString() !== userId) {
            return res.status(403).json({ message: "Unauthorized action" });
        }

        // ✅ Delete booking
        await Booking.findByIdAndDelete(id);

        // ✅ Send Notification to User
        sendNotification(userId, "Your booking has been canceled.", "Booking");

        // ✅ Send Notification to Admin
        sendNotification(booking.hostel.ownerId, `Booking for ${booking.hostel.name} has been canceled by User ID: ${userId}`, "Admin");

        res.status(200).json({ message: "Booking canceled successfully" });

    } catch (error) {
        console.error("Cancel Booking Error:", error.message);
        res.status(500).json({ message: "Error canceling booking", error: error.message });
    }
};

// ✅ Get User Bookings
const getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user.id }).populate('hostel', 'name location');
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bookings', error: error.message });
    }
};

module.exports = { bookHostel, cancelBooking, getBookings };
