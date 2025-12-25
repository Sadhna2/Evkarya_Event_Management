const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["vendor", "user"], required: true },
    phone: { type: Number, required: true },
    acceptedTerms: { type: Boolean, required: true },

    upiId: { type: String, required: true },

    bio: { type: String, default: "" },
    availability: { type: Boolean, default: true },
    notAvailableDates: { type: [Date], default: [] },
    review: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },

    categories: {
      type: [String],
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
      ],
      default: []
    }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Vendor || mongoose.model("Vendor", vendorSchema);
