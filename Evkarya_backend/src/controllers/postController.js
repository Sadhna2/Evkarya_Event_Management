const Vendor = require("../models/vendor_model");
const Post = require("../models/post_model");
const { RESPONSE_MESSAGES } = require("./constant");
const mongoose = require("mongoose");

const createPost = async (req, res) => {
  try {
    const {
      vendorId,
      title,
      imageUrl,
      description,
      price,
      discountedPrice,
      discountPercent,
      color,
      size,
      category,
      availability,
      notAvailableDates = [],
    } = req.body;

    if (!vendorId || !title || !description || !price || !category) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields. Please provide vendorId, title, description, price, and category.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(vendorId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vendor ID format.",
      });
    }

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: RESPONSE_MESSAGES.VENDOR_NOT_FOUND,
      });
    }

    const today = new Date().toISOString().split("T")[0];
    const isPostAvailable = !notAvailableDates.some(
      (date) => new Date(date).toISOString().split("T")[0] === today
    );

    const post = new Post({
      vendorId,
      title,
      imageUrl,
      description,
      price,
      discountedPrice,
      discountPercent,
      color,
      size,
      category,
      availability: availability !== undefined ? availability : isPostAvailable,
      notAvailableDates,
    });

    await post.save();

    res.status(201).json({
      success: true,
      message: RESPONSE_MESSAGES.POST_CREATED,
      post,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({
      success: false,
      message: "Error creating post",
      error: error.errors || error.message,
    });
  }
};

const editPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const {
      title,
      imageUrl,
      description,
      price,
      discountedPrice,
      discountPercent,
      color,
      size,
      category,
      availability,
      notAvailableDates,
    } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: RESPONSE_MESSAGES.POST_NOT_FOUND,
      });
    }

    const vendor = await Vendor.findById(post.vendorId);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: RESPONSE_MESSAGES.VENDOR_NOT_FOUND,
      });
    }

    const isVendorAvailable = vendor.availability?.status !== false;

    if (availability === true && !isVendorAvailable) {
      return res.status(400).json({
        success: false,
        message:
          "Vendor is currently unavailable. Cannot set post availability to true.",
      });
    }

    if (title) post.title = title;
    if (imageUrl) post.imageUrl = imageUrl;
    if (description) post.description = description;
    if (price) post.price = price;
    if (discountedPrice) post.discountedPrice = discountedPrice;
    if (discountPercent) post.discountPercent = discountPercent;
    if (color) post.color = color;
    if (size) post.size = size;
    if (category) post.category = category;

    if (availability !== undefined) post.availability = availability;

    if (notAvailableDates) {
      post.notAvailableDates = notAvailableDates;

      if (availability === undefined) {
        const today = new Date().toISOString().split("T")[0];
        post.availability = !notAvailableDates.some(
          (date) => new Date(date).toISOString().split("T")[0] === today
        );
      }
    }

    await post.save();

    res.status(200).json({
      success: true,
      message: RESPONSE_MESSAGES.POST_UPDATED,
      post,
    });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({
      success: false,
      message: "Error updating post",
      error: error.message,
    });
  }
};

const getCategories = (req, res) => {
  try {
    const categories = Post.schema.path("category").enumValues;
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ message: "Error fetching categories", error: err.message });
  }
};

const getPostsByCategory = async (req, res) => {
  const { category } = req.query;

  try {
    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category is required",
      });
    }

    const validCategories = Post.schema.path("category").enumValues;
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category",
      });
    }

    const posts = await Post.find({ category });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching posts", error: err.message });
  }
};


const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findByIdAndDelete(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: RESPONSE_MESSAGES.POST_NOT_FOUND,
      });
    }

    res.status(200).json({
      success: true,
      message: RESPONSE_MESSAGES.POST_DELETED,
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting post",
      error: error.message,
    });
  }
};


const getSinglePostById = async (req, res) => {
  try {
    const { postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID format.",
      });
    }

    const post = await Post.findById(postId).populate("vendorId", "name contact email");

    if (!post) {
      return res.status(404).json({
        success: false,
        message: RESPONSE_MESSAGES.POST_NOT_FOUND,
      });
    }

    const today = new Date().toISOString().split("T")[0];
    const isUnavailableToday = post.notAvailableDates?.some(
      (date) => new Date(date).toISOString().split("T")[0] === today
    );

    const actualAvailability = post.availability === false
      ? false
      : !isUnavailableToday;

    res.status(200).json({
      success: true,
      message: "Post details fetched successfully",
      post: {
        ...post._doc,
        availability: actualAvailability,
      },
    });
  } catch (error) {
    console.error("Error fetching post by ID:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch post details",
      error: error.message,
    });
  }
};



const getVendorPosts = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: RESPONSE_MESSAGES.VENDOR_NOT_FOUND,
      });
    }

    const vendorPosts = await Post.find({ vendorId }).sort({ createdAt: -1 });
    const today = new Date().toISOString().split("T")[0];

    const updatedPosts = vendorPosts.map((post) => {
      const isUnavailableToday = post.notAvailableDates?.some(
        (date) => new Date(date).toISOString().split("T")[0] === today
      );

      const actualAvailability = post.availability === false
        ? false
        : !isUnavailableToday;

      return {
        ...post._doc,
        availability: actualAvailability,
      };
    });

    res.status(200).json({
      success: true,
      message: "Posts fetched successfully",
      data: updatedPosts,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch posts",
      error: error.message,
    });
  }
};


module.exports = {
  createPost,
  editPost,
  deletePost,
  getVendorPosts,
  getCategories,
  getPostsByCategory,
  getSinglePostById,
};
