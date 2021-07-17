const mongoose = require('mongoose');

const BookingSchema = mongoose.Schema({
   user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
   },
   title: {
      type: String,
      required: true
   },
   name: {
      type: String,
      required: true
   },
   email: {
      type: String,
      required: true
   },
   city: {
      type: String,
      required: true
   },
   address: {
      type: String,
      required: true
   },
   phoneNo: {
      type: String,
      required: true
   },
   seats: {
      type: Number,
      required: true
   },
   startDate: {
      type: Date
   },
   endDate: {
      type: Date
   },
   paymentMethod: {
      type: String,
   },
   totalPrice: {
      type: Number,
      required: true
   },
   isPaid: {
      type: Boolean,
      default: false
   },
   paidAt: {
      type: Date,
   },
//    paymentResult: {
//       id: { type: String },
//       status: { type: String },
//       update_time: { type: String },
//       email_address: { type: String },
//   },
   booking_status: {
      type: String,
      default: 'pending'
   },
}, { timestamps: true });

const BookingModel = mongoose.model('Booking', BookingSchema);
module.exports = BookingModel;
