const Order = require("../models/order_model");
const User = require("../login/userModel");
const Post = require("../models/post_model");
const Vendor = require("../models/vendor_model");
const { sendMail } = require("../mailer");
const { generateOrderUpdateMail } = require("../orderUpdateMail");

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      postId,
      totalAmount,
      eventDate,
      eventLocation,
      phoneNumber,
      requirements,
    } = req.body;

    if (
      !eventLocation ||
      !phoneNumber ||
      !postId ||
      !userId ||
      !totalAmount ||
      !eventDate
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields." });
    }

    const existingOrder = await Order.findOne({
      postId,
      userId,
      status: { $in: ["pending", "confirmed", "partially paid"] },
    });

    if (existingOrder) {
      return res.status(400).json({
        success: false,
        message: "You already have an active order for this post",
      });
    }

    const postDoc = await Post.findById(postId);
    if (!postDoc) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const order = new Order({
      vendorId: postDoc.vendorId,
      postId: postDoc.id,
      category: postDoc.category,
      userId,
      userName: user.name,
      email: user.email,
      phoneNumber,
      eventDate,
      eventLocation,
      requirements: requirements || "",
      totalAmount,
      paidAmount: 0,
      remainingAmount: totalAmount,
      status: "pending",
    });

    await order.save();

    const mailContent = generateOrderUpdateMail(
      "pending",
      user.name,
      order._id,
      order.eventDate.toDateString()
    );
    await sendMail(
      user.email,
      "Your EvKarya Order Has Been Created, wait till confirmation of vendor",
      mailContent
    );

    res.status(201).json({
      success: true,
      message: "Order created successfully. Waiting for vendor approval.",
      order,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const confirmOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const confirmedOrder = await Order.findById(orderId).populate(
      "userId",
      "email name"
    );
    if (!confirmedOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    confirmedOrder.status = "confirmed";
    await confirmedOrder.save();

    await Post.findByIdAndUpdate(
      confirmedOrder.postId,
      {
        $set: { availability: false },
        $addToSet: { notAvailableDates: confirmedOrder.eventDate },
      },
      { new: true }
    );

    const vendor = await Vendor.findById(confirmedOrder.vendorId);
    if (!vendor) {
      return res
        .status(404)
        .json({ success: false, message: "Vendor not found" });
    }

    const confirmMail = generateOrderUpdateMail(
      "waiting for partial payment",
      confirmedOrder.userId.name,
      confirmedOrder._id,
      confirmedOrder.eventDate.toDateString(),
      vendor.upiId
    );

    await sendMail(
      confirmedOrder.userId.email,
      "Your EvKarya Order Has Been Confirmed, Please Make Partial Payment",
      confirmMail
    );

    const discardedOrders = await Order.find({
      postId: confirmedOrder.postId,
      _id: { $ne: confirmedOrder._id },
      status: "pending",
    }).populate("userId", "email name");

    for (const order of discardedOrders) {
      order.status = "discarded";
      await order.save();

      const cancelMail = generateOrderUpdateMail(
        "discarded",
        order.userId.name,
        order._id,
        order.eventDate.toDateString(),
        vendor.upiId
      );

      await sendMail(
        order.userId.email,
        "Your EvKarya Booking Request Has Been Declined",
        cancelMail
      );
    }

    res.status(200).json({
      success: true,
      message:
        "Order confirmed. Other pending requests have been discarded. Post marked as unavailable.",
    });
  } catch (error) {
    console.error("Error confirming order:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const handlePartialPayment = async (req, res) => {
  try {
    const { orderId, paymentAmount } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    order.paidAmount += paymentAmount;
    order.remainingAmount = order.totalAmount - order.paidAmount;

    if (order.paidAmount === order.totalAmount) {
      order.status = "completed";
    } else if (order.paidAmount > 0) {
      order.status = "partially paid";
    }

    await order.save();

    const paymentMailContent = generateOrderUpdateMail(
      order.status,
      order.userId.name,
      order._id,
      order.eventDate.toDateString()
    );

    await sendMail(
      order.userId.email,
      `Your EvKarya Order Payment Status: ${order.status}`,
      paymentMailContent
    );

    res.status(200).json({
      success: true,
      message: `Payment received. Order status is now '${order.status}'`,
      order,
    });
  } catch (error) {
    console.error("Error processing partial payment:", error);
    res
      .status(500)
      .json({ success: false, message: "Error processing partial payment" });
  }
};

const handleFullPayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    order.status = "completed";
    await order.save();

    const completedMailContent = generateOrderUpdateMail(
      "completed",
      order.userId.name,
      order._id,
      order.eventDate.toDateString()
    );

    await sendMail(
      order.userId.email,
      "Your EvKarya Order is Completed",
      completedMailContent
    );

    res.status(200).json({
      success: true,
      message: `Order ID: ${orderId} has been completed.`,
    });
  } catch (error) {
    console.error("Error processing full payment:", error);
    res
      .status(500)
      .json({ success: false, message: "Error processing full payment" });
  }
};

const getOrdersForVendor = async (req, res) => {
  try {
    const vendorId = req.params.vendorId;

    const orders = await Order.find({ vendorId })
      .populate("userId", "name email")
      .populate("postId", "title")
      .lean();

    const safeOrders = orders.filter((order) => order.postId);

    if (!safeOrders.length) {
      return res
        .status(404)
        .json({ success: false, message: "No orders found for this vendor." });
    }

    res.status(200).json({
      success: true,
      data: safeOrders,
    });
  } catch (error) {
    console.error("Error fetching vendor orders:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const discardOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate(
      "userId",
      "email name"
    );
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    order.status = "discarded";
    await order.save();

    const otherActiveOrders = await Order.find({
      postId: order.postId,
      _id: { $ne: order._id },
      status: { $in: ["pending", "waiting for partial payment"] },
    });

    if (otherActiveOrders.length === 0) {
      await Post.findByIdAndUpdate(order.postId, { availability: true });
    }

    const discardMail = generateOrderUpdateMail(
      "discarded",
      order.userId.name,
      order._id,
      order.eventDate.toDateString()
    );

    await sendMail(
      order.userId.email,
      "Your EvKarya Booking Request Has Been Declined",
      discardMail
    );

    res.status(200).json({
      success: true,
      message: "Order has been discarded and user notified.",
    });
  } catch (error) {
    console.error("Error discarding order:", error);
    res
      .status(500)
      .json({ success: false, message: "Error discarding order" });
  }
};

const checkPostBookingStatus = async (req, res) => {
  try {
    const { postId, userId } = req.params;

    const confirmedOrder = await Order.findOne({
      postId,
      status: "confirmed",
    });

    const userOrder = await Order.findOne({
      postId,
      userId,
      status: { $in: ["pending", "confirmed", "partially paid"] },
    });

    res.json({
      postBookedBySomeoneElse:
        !!confirmedOrder &&
        confirmedOrder.userId.toString() !== userId,
      hasUserOrder: !!userOrder,
      userOrderStatus: userOrder ? userOrder.status : null,
    });
  } catch (error) {
    console.error("Error checking booking status:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  createOrder,
  confirmOrder,
  handlePartialPayment,
  handleFullPayment,
  getOrdersForVendor,
  checkPostBookingStatus,
  discardOrder,
};
