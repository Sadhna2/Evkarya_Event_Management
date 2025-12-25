const express = require("express");
const { createPost, editPost, deletePost,getPostsByCategory, getVendorPosts,getCategories,getSinglePostById } = require("../controllers/postController"); // Import getPosts from controller
const router = express.Router();


router.get("/vendor/:vendorId", getVendorPosts);

router.post("/", createPost);


router.put("/:postId", editPost);


router.delete("/:postId", deletePost);


router.get("/:postId", getSinglePostById);

router.get("/categories", getCategories); 

router.get("/", getPostsByCategory); 

module.exports = router;
