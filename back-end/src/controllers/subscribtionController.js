import { Subscription } from "../models/subscribtionModel.js";

export const subscribe = async (req, res) => {
  try {
    const { email, userId } = req.body;

    // Check if email already exists
    const existingSubscription = await Subscription.findOne({ email });
    if (existingSubscription) {
      return res.status(400).json({
        meta: { success: false, message: "Already subscribed" }
      });
    }

    const newSubscription = new Subscription({ email, userId });
    await newSubscription.save();

    return res.status(200).json({
      meta: { success: true, message: "Subscribed successfully" }
    });

  } catch (error) {
    return res.status(500).json({ meta: { success: false, message: error.message } });
  }
};

export const unsubscribe = async (req, res) => {
    try {
      const { email } = req.body;
      
      const deleted = await Subscription.findOneAndDelete({ email });
      if (!deleted) {
        return res.status(404).json({
          meta: { success: false, message: "Subscription not found" }
        });
      }
  
      return res.status(200).json({
        meta: { success: true, message: "Unsubscribed successfully" }
      });
  
    } catch (error) {
      return res.status(500).json({ meta: { success: false, message: error.message } });
    }
  };
  
