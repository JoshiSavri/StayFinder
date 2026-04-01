const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const Booking = require("../models/booking");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post("/create-order/:id", async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  const options = {
    amount: booking.totalPrice * 100, // paisa
    currency: "INR",
    receipt: "booking_" + booking._id,
  };

  const order = await razorpay.orders.create(options);

  res.json({
    orderId: order.id,
    amount: options.amount,
    key: process.env.RAZORPAY_KEY_ID,
    bookingId: booking._id,
  });
});  

// ✅ 3. PAYMENT SUCCESS  👇 (PUT HERE)
router.get("/:id/success", async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  booking.status = "confirmed";
  booking.paymentStatus = "paid";

  await booking.save();

  res.render("payments/success", { booking });
});

// ✅ PAYMENT PAGE
router.get("/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("listing");   // ✅ HERE (inside async)

    res.render("payments/checkout", { booking });

  } catch (err) {
    console.log(err);
    res.send("Error loading payment page");
  }
});


router.post("/:id/success", async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  booking.paymentStatus = "verification_pending"; // 👈 NEW
  booking.status = "pending";

  await booking.save();

  res.render("payments/waiting", { booking });
});
module.exports = router;