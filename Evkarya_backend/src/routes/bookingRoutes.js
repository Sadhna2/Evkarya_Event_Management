const express = require("express");
const router = express.Router();

const Booking = require("../models/Booking"); 

router.get("/user/:userId", async (req, res) => {
    try {
      const bookings = await Booking.find({ userId: req.params.userId }).populate("productId");
      res.json({ bookings });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch user bookings" });
    }
  });
router.post("/", async (req, res) => {
  try {
    const { productId, userId, userName, userEmail } = req.body;

    const booking = new Booking({
      productId,
      userId,
      userName,
      userEmail,
    });

    await booking.save();

    res.status(201).json({ message: "Booking successful", booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Booking failed" });
  }
});

module.exports = router;

