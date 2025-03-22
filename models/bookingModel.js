const mongoose = require('mongoose');

// const bookingSchema = new mongoose.Schema({
//     user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     hostel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hostel', required: true },
//     checkInDate: { type: Date, required: true },
//     checkOutDate: { type: Date, required: true },
//     paymentMethod: { type: String, enum: ['Cash', 'Online'], required: true },
//     status: { type: String, enum: ['Confirmed', 'Cancelled'], default: 'Confirmed' }
// }, { timestamps: true });


const bookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User',  },
    hostel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hostel', },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    paymentMethod: { type: String, enum: ['Cash', 'Online'], },
    status: { type: String, enum: ['Confirmed', 'Cancelled'], default: 'Confirmed' }
}, { timestamps: true });




const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;