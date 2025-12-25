const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    discountedPrice: {
      type: Number,
    },
    discountPercent: {
      type: Number,
    },
    color: {
      type: String,
    },
    size: {
      type: [String],
    },

   
    category: {
      type: String,
      required: true,
      enum: [
     
        "Bridal Wear", "Jewelry", "Makeup & Styling",

      
        "Decor & Venues", "Theme Parties", "Cake & Decorations",

       
        "Photography", "Entertainment", "Wedding Bands", "Choreographers", "Mehendi Artists",

      
        "Wedding Cakes", "Menu - Vegetarian", "Menu - Non-Vegetarian", "Menu - Buffet", "Menu - Custom",
        "Live Counters", "Desserts & Beverages",

      
        "Themes & Decor",

        "Party Entertainment", "Party Planners", "Return Gifts", "Magicians & Clowns",

      
        "Wedding DJs", "Party DJs", "Corporate Events",

      
        "Live Bands", "Sound & Lighting", "Dance Floors"
      ]
    },


    availability: { type: Boolean, default: true },
    notAvailableDates: { type: [Date], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
