const express = require("express");
const Order = require("../models/Order");
const Bot = require("../models/Bot");

const router = express.Router(); // ✅ This line initializes the router

// Place Order Route
router.post("/place-order", async (req, res) => {
  const { userId, items, deliveryAddress } = req.body;

  try {
    console.log("Received order request:", req.body); // Debugging log

    if (!userId || !items || !deliveryAddress) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Calculate total amount
    const totalAmount = items.reduce((total, item) => total + item.price * item.quantity, 0);

    // Create a new order
    const newOrder = new Order({
      userId,
      items,
      totalAmount,
      deliveryAddress,
    });

    // Save the order to the database
    await newOrder.save();

    // Assign a bot to the order
    const availableBot = await Bot.findOne({ status: "available" });

    if (!availableBot) {
      return res.status(400).json({ message: "No available bots for delivery" });
    }

    // Update bot status to 'busy'
    availableBot.status = "busy";
    await availableBot.save();

    // Assign the bot to the order
    newOrder.assignedBot = availableBot._id;
    newOrder.status = "assigned";
    await newOrder.save();

    res.status(201).json({ order: newOrder, bot: availableBot });
  } catch (error) {
    console.error("Error placing order:", error); // Log the actual error
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router; // ✅ Ensure this line is at the end
