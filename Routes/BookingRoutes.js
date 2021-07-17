const express = require('express');
const BookingControllers = require('../Controllers/BookingControllers');
const { check } = require('express-validator');
const router = express.Router();
const { auth } = require('../middleware/auth')


// Create a Booking
router.post('/',
    [
        check('name').not().isEmpty(),
        check('address').not().isEmpty()
    ], auth, 
    BookingControllers.createBooking);

// get a Booking by ID
router.get('/:id', auth, BookingControllers.getBookingById);

//Get all Bookings
router.get('/', BookingControllers.getBookings);

//Delete a Booking
router.delete('/:id', BookingControllers.deleteBooking);

// Confirm Booking
router.put('/:id/confirm', BookingControllers.confirmBooking)

// Cancel Booking
router.put('/:id/cancel', BookingControllers.cancelBooking)

// Update Order to Paid
router.put('/:id/pay', auth, BookingControllers.updateBookingToPaid)

// Update Payment Method
router.put('/:id/paymentMethod', auth, BookingControllers.updatePaymentMethod)

// Get booking by user ID
router.get('/user/:id', BookingControllers.getBookingsByUserId)


module.exports = router;