const express = require("express");
const router = express.Router();
const { updatePendingOrderByVendor } = require("../controllers/vendorOrder.controller");


router.put("/vendor/order/:orderId", updatePendingOrderByVendor);

module.exports = router;
