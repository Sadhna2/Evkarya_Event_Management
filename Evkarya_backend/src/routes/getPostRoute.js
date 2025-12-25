const express = require("express");
const router = express.Router();
const { getPostsByCategory } = require("../controllers/getPostsByCategory");

router.get("/posts", getPostsByCategory); 

module.exports = router;
