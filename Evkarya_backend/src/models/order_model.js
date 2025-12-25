const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    category: { type: String, required: true },

    userName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },

    eventDate: { type: Date, required: true },
    eventLocation: { type: String, required: true },
    requirements: { type: String }, // optional

    totalAmount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    remainingAmount: {
      type: Number,
      default: function () {
        return this.totalAmount - this.paidAmount;
      },
    },

    status: {
      type: String,
      enum: ['pending', 'confirmed', 'partially paid', 'completed', 'cancelled','discarded'],
      default: 'pending',
    },

    confirmedByVendor: { type: Boolean, default: false },

    qrCode: { 
      type: String, 
      default: null 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
