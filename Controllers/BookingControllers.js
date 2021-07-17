const Booking = require('../Models/Booking');
const { validationResult } = require('express-validator');
const HttpError = require('../Models/HttpError');
const asyncHandler = require('express-async-handler')

// CREATE A NEW BOOKING
const createBooking = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid input. Check your data', 422)
        );
    }

    const { title, name, email, city, address, phoneNo, seats, startDate, endDate, paymentMethod, totalPrice, isPaid, paidAt, booking_confirmed } = req.body;

    const createdBooking = new Booking({
        user: req.user._id,
        title,
        name,
        email,
        city,
        address,
        phoneNo,
        seats,
        startDate,
        endDate,
        paymentMethod: 'Unpaid',
        totalPrice,
        isPaid,
        paidAt,
        booking_confirmed
    });

    try {
        await createdBooking.save();
    } catch (err) {
        const error = new HttpError('Creating booking failed, please try again.', 500);
        return next(error);
    }
    res.status(201).send(createdBooking);
}

// GET ALL BOOKINGS
const getBookings = async (req, res, next) => {
    let bookings;
    try {
        bookings = await Booking.find();
    } catch (err) {
        const error = new HttpError('Unknown error occured while getting bookings, please try again.', 500);
        return next(error);
    }
    res.send(bookings);
}


// GET A BOOKING BY ID
const getBookingById = async (req, res, next) => {
    const bookingId = req.params.id
    let booking
    try {
        booking = await Booking.findById(bookingId);
    } catch (err) {
        const error = new HttpError('Unknown error occured while getting booking, please try again.', 500);
        return next(error);
    }

    if (!booking) {
        const error = new HttpError('Could not find a booking for the provided id.', 404);
        return next(error);
    }

    res.json(booking);
}

// DELETE BOOKING
const deleteBooking = async (req, res, next) => {
    const bookingId = req.params.id;
    let booking;
    try {
        booking = await Booking.findById(bookingId);
    } catch (err) {
        const error = new HttpError('Unknown error occured while deleting booking, please try again.', 500);
        return next(error);
    }

    try {
        await booking.remove();
    } catch (err) {
        const error = new HttpError('Unknown error occured while deleting booking, please try again.', 500);
        return next(error);
    }

    res.status(200).json({ message: 'booking has been deleted' });
}

// CONFIRM Booking
const confirmBooking = async (req, res, next) => {
    const bookingId = req.params.id;
    let booking;
    try {
        booking = await Booking.findById(bookingId);
    } catch (err) {
        const error = new HttpError('Unknown error occured while deleting booking, please try again.', 500);
        return next(error);
    }

    try {
        booking.booking_status= 'confirmed'

    } catch (err) {
        const error = new HttpError('Unknown error occured while deleting booking, please try again.', 500);
        return next(error);
    }
    const updatedBooking = await booking.save()

    res.json(updatedBooking);
}

// CANCEL Booking
const cancelBooking = async (req, res, next) => {
    const bookingId = req.params.id;
    let booking;
    try {
        booking = await Booking.findById(bookingId);
    } catch (err) {
        const error = new HttpError('Unknown error occured while cancelling booking, please try again.', 500);
        return next(error);
    }

    try {
        booking.booking_status= 'cancelled'

    } catch (err) {
        const error = new HttpError('Unknown error occured while cancelling booking, please try again.', 500);
        return next(error);
    }
    const updatedBooking = await booking.save()

    res.json(updatedBooking);
}

// UPDATE BOOKING TO PAID
const updateBookingToPaid = async (req, res, next) => {
    const {created, email, id } = req.body
    console.log(email)
    const bookingId = req.params.id;
    let booking;
    try {
        booking = await Booking.findById(bookingId);
    } catch (err) {
        const error = new HttpError('Unknown error occured while deleting booking, please try again.', 500);
        return next(error);
    }

    try {
        booking.isPaid = true
        booking.paidAt = Date.now()
        // booking.paymentResult = {
        //     id: req.body.id,
        //     status: req.body.status,
        //     update_time: req.body.created,
        //     email_address: req.body.payer.email,
        //   }


    } catch (err) {
        const error = new HttpError('Unknown error occured while updating booking, please try again.', 500);
        return next(error);
    }
    const updatedBooking = await booking.save()


    res.json(updatedBooking);
}

// Update Payment Method
const updatePaymentMethod = async (req, res, next) => {
    const bookingId = req.params.id;
    let booking;
    try {
        booking = await Booking.findById(bookingId);
    } catch (err) {
        const error = new HttpError('Unknown error occured while deleting booking, please try again.', 500);
        return next(error);
    }

    try {
        booking.paymentMethod = req.body.paymentMethod

    } catch (err) {
        const error = new HttpError('Unknown error occured while deleting booking, please try again.', 500);
        return next(error);
    }
    const updatedBooking = await booking.save()

    res.json(updatedBooking);
}

// Get booking by User ID
const getBookingsByUserId = async (req, res, next) => {
    let id = req.params.id
    let bookings
    try {
        bookings = await Booking.find({user:id})
    } catch (err) {
        const error = new HttpError('Unknown error occured while fingind required bookings, please try again.', 500);
        return next(error);
    }
    if (bookings.length===0){
        const err = new HttpError('No Bookings Found',500);
        return next(err)
      }
      else{
        res.send(bookings)
      }
}


// EXPORTING ALL CONTROllERS HERE
exports.createBooking = createBooking;
exports.getBookings = getBookings;
exports.deleteBooking = deleteBooking;
exports.getBookingById = getBookingById;
exports.confirmBooking = confirmBooking;
exports.cancelBooking = cancelBooking;
exports.updateBookingToPaid = updateBookingToPaid;
exports.updatePaymentMethod = updatePaymentMethod;
exports.getBookingsByUserId = getBookingsByUserId;
