const mongoose = require("mongoose");

const BotSchema = new mongoose.Schema({
  botId: { type: String, required: true, unique: true },
  status: { type: String, enum: ["available", "busy", "charging"], default: "available" },
  location: { type: String, required: true },
});

module.exports = mongoose.model("Bot", BotSchema);
