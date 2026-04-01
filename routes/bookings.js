const express = require("express");
const router = express.Router();

const Booking = require("../models/booking");
const Listing = require("../models/listing");
const { isLoggedIn } = require("../middleware"); // ✅ FIX

router.post("/:id", isLoggedIn, async (req, res) => {
  try {
    const { checkIn, checkOut } = req.body;

    const listing = await Listing.findById(req.params.id);

    const days =
      (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);

    const totalPrice = days * listing.price;

    const booking = new Booking({
      listing: listing._id,
      user: req.user._id,
      checkIn,
      checkOut,
      totalPrice,
    });

    await booking.save();

    res.redirect(`/payments/${booking._id}`);

  } catch (err) {
    console.log(err);
    res.send("Booking error");
  }
});

router.get("/", isLoggedIn, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("listing");

    console.log(bookings); // 👈 debug

    res.render("bookings/index", { bookings });

  } catch (err) {
    console.log(err);
    res.send("Error loading bookings");
  }
});

module.exports = router;