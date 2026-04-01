const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listing",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  checkIn: {
    type: Date,
    required: true,
  },
  checkOut: {
    type: Date,
    required: true,
  },
  totalPrice: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
  type: String,
  enum: ["pending", "confirmed"],
  default: "pending",
},
paymentStatus: {
  type: String,
  enum: ["pending", "paid"],
  default: "pending"
},
});

module.exports = mongoose.model("Booking", bookingSchema);