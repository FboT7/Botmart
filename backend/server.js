require("dotenv").config(); // Load environment variables

const express = require("express"); // Only declared once
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express(); // No duplicate app declaration
app.use(cors());
app.use(express.json()); // Middleware to parse JSON

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

app.get("/", (req, res) => {
  res.send("BotMart API is running...");
});

// Use Routes
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const path = require("path");

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, "../frontend")));

// Handle favicon request
app.get('/favicon.ico', (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/favicon.ico"));
});

