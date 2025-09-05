const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: String, // Format: YYYY-MM-DD
    required: true,
  },
  time: {
    type: String, // Format: HH:mm
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed"],
    default: "pending",
  },
  fee: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Appointment", appointmentSchema);