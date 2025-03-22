const express = require('express');
const { bookHostel, cancelBooking, getBookings } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/book', protect, bookHostel);
router.delete('/cancel/:id', protect, cancelBooking);
router.get('/user-bookings', protect, getBookings);


module.exports = router;