const Order = require("../models/order_model");

const updatePendingOrderByVendor = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { action } = req.body; 

  
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.status !== "pending") {
      return res.status(400).json({ success: false, message: "Order already processed." });
    }

    if (action === "confirm") {
      order.status = "confirmed";
    } else if (action === "decline") {
      order.status = "cancelled";
    } else {
      return res.status(400).json({ success: false, message: "Invalid action" });
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: `Order has been ${order.status}.`,
      order,
    });
  } catch (error) {
    console.error("Error updating pending order:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { updatePendingOrderByVendor };
