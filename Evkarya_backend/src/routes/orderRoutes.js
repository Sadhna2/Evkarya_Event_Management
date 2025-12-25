const express = require("express");
const router = express.Router();
const { 
  createOrder,  
  getOrdersForVendor,
  confirmOrder,
  checkPostBookingStatus, 
  discardOrder,
  handleFullPayment,
} = require("../controllers/order");

router.post("/create", createOrder);


router.get("/post/:postId/user/:userId", checkPostBookingStatus);
router.get("/:vendorId", getOrdersForVendor);
router.delete('/cancel/:orderId', discardOrder);

router.put('/confirm/:orderId', confirmOrder);

router.put('/full-payment/:orderId', handleFullPayment);

module.exports = router;
