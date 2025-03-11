import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }, // If logged-in users can subscribe
  createdAt: { type: Date, default: Date.now }
});

export const Subscription = mongoose.model("Subscription", SubscriptionSchema);
