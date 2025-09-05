  const mongoose = require("mongoose");

  const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    dob: { type: Date, required: true },
    role: {
      type: String,
      enum: ["patient", "doctor", "admin"],
      required: true,
      default: "patient",
    },
    isVerified: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ["active", "suspended"],
      default: "active",
    },
    specialty: { type: String, default: null },
    experience: { type: String, default: null },
    about: { type: String, default: null },
    appointmentFee: { type: String, default: null },
    profilePic: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
  });

  module.exports = mongoose.model("User", userSchema);
