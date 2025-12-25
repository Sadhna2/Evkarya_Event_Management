const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Vendor = require("../models/vendor_model");
const User = require("../login/userModel");
const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, email, phone, password, role, acceptedTerms, upiId } = req.body;

  try {
  
    const existing =
      role === "vendor"
        ? await Vendor.findOne({ email })
        : await User.findOne({ email });

    if (existing) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    let newAccount;

    if (role === "vendor") {
      if (!acceptedTerms) {
        return res.status(400).json({ message: "Terms must be accepted" });
      }

      if (!upiId || upiId.trim() === "") {
        return res.status(400).json({ message: "UPI ID is required for vendors" });
      }

      newAccount = new Vendor({
        name,
        email,
        phone,
        password: hashedPassword,
        role,
        acceptedTerms,
        upiId,
      });
    } else {
      newAccount = new User({
        name,
        email,
        password: hashedPassword,
      });
    }

    await newAccount.save();
    res.status(201).json({ message: "Registered successfully", user: newAccount });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Vendor.findOne({ email }) || await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ message: "Login successful", token, user });
  } catch (err) {
    res.status(500).json({ message: "Login error", error: err.message });
  }
});

module.exports = router;
