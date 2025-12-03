import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  storeId: { type: String, required: true },
  userId: String,
  addressId: String,
  total: { type: Number, default: 0 },
  shippingFee: { type: Number, default: 0 },
  status: { type: String, default: "ORDER_PLACED" },
  paymentMethod: String,
  paymentStatus: String,
  isPaid: { type: Boolean, default: false },
  isCouponUsed: { type: Boolean, default: false },
  coupon: Object,
  isGuest: { type: Boolean, default: false },
  guestName: String,
  guestEmail: String,
  guestPhone: String,
  shippingAddress: Object,
  orderItems: Array,
  items: Array,
  // Add more fields as needed
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
