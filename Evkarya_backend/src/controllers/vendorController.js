const Vendor = require("../models/vendor_model");
const Post = require("../models/post_model");
const { RESPONSE_MESSAGES } = require("./constant");
const mongoose = require("mongoose");

const createVendor = async (req, res) => {
  try {
    const { categories, name, email, bio, notAvailableDates, availability, phone, upiId } = req.body;

    const today = new Date().toISOString().split("T")[0];
    const isAvailable = !notAvailableDates.some(
      (date) => new Date(date).toISOString().split("T")[0] === today
    );

    const vendor = await Vendor.create({
      categories: categories || [], 
      name,
      email,
      bio,
      notAvailableDates,
      availability: availability !== undefined ? availability : isAvailable, 
      phone,
      upiId,
    });

    res.status(201).json({
      message: "Vendor created successfully",
      vendor,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating vendor",
      error,
    });
  }
};



const editVendorProfile = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const updateData = req.body;

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res
        .status(404)
        .json({ message: RESPONSE_MESSAGES.VENDOR_NOT_FOUND });
    }

    if (updateData.notAvailableDates) {
      const today = new Date().toISOString().split("T")[0];
      updateData.availability = !updateData.notAvailableDates.some(
        (date) => new Date(date).toISOString().split("T")[0] === today
      );
    }

    if (updateData.categories) {
      vendor.categories = updateData.categories;
    }

    Object.assign(vendor, updateData);
    await vendor.save();

    res.status(200).json({
      message: RESPONSE_MESSAGES.VENDOR_UPDATED,
      vendor,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating vendor",
      error,
    });
  }
};

const getVendorWithPosts = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res
        .status(404)
        .json({ message: RESPONSE_MESSAGES.VENDOR_NOT_FOUND });
    }

    const today = new Date().toISOString().split("T")[0];
    if (vendor.notAvailableDates?.some(
      (date) => new Date(date).toISOString().split("T")[0] === today
    )) {
      vendor.availability = false;
    } else {
      vendor.availability = true;
    }

    const posts = await Post.find({ vendorId }).sort({ createdAt: -1 });

    res.status(200).json({
      vendor,
      posts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching vendor info",
      error,
    });
  }
};

const getVendorWithServices = async (req, res) => {
  try {
    const { vendorId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(vendorId)) {
      return res.status(400).json({ message: "Invalid vendor ID format" });
    }

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    const today = new Date().toISOString().split("T")[0];
    if (vendor.notAvailableDates?.some(
      (date) => new Date(date).toISOString().split("T")[0] === today
    )) {
      vendor.availability = false;
    } else {
      vendor.availability = true;
    }

    res.status(200).json({ vendor });
  } catch (error) {
    console.error("Error fetching vendor bio:", error);
    res.status(500).json({
      message: "Internal Server Error while fetching vendor bio",
      error: error.message,
    });
  }
};


module.exports = {
  createVendor,
  editVendorProfile,
  getVendorWithPosts,
  getVendorWithServices,
};