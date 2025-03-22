const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String, required: true },
});

// Avoid overwriting the model
const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;

