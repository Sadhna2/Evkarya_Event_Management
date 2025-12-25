const express = require("express");
const {
  createVendor,
  editVendorProfile,
  getVendorWithPosts,
  getVendorWithServices,
} = require("../controllers/vendorController");

const router = express.Router();


router.post("/", createVendor);


router.put("/:vendorId", editVendorProfile);


router.get("/:vendorId/posts", getVendorWithPosts);

router.get("/:vendorId/bio", getVendorWithServices);

module.exports = router;
