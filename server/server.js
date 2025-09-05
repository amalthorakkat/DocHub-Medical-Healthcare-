require("dotenv").config(); // Load .env first
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
require("./models/UserModel");
require("./models/AppointmentModel");

const app = express();

// Debugging environment variables
console.log("Environment Variables:", {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI ? "Set" : "Not Set",
  JWT_SECRET: process.env.JWT_SECRET ? "Set" : "Not Set",
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ? "Set" : "Not Set",
});

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// Serve uploaded images
app.use("/uploads", express.static("uploads"));

// Connect DB
connectDB();

// Routes
app.use("/api/users", userRoutes);
app.use("/api/appointments", appointmentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
