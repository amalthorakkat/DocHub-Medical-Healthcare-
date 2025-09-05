


const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getDoctor,
  getDoctors,
  createUser,
  updateUser,
  deleteUser,
  deleteProfilePic,
  verifyDoctor,
  createInitialAdmin,
  getPatients,
} = require("../controllers/authController");
const { adminAuth } = require("../middlewares/auth");
const upload = require("../config/multerConfig");

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/doctors", getDoctors); // Public for Doctors.jsx, AllDoctors.jsx
router.get("/doctor/:id", getDoctor); // Public for DoctorDetails.jsx

// Admin routes
router.post("/admin/users", adminAuth, upload.single("profilePic"), createUser);
router.put("/admin/users/:id", adminAuth, upload.single("profilePic"), updateUser);
router.delete("/admin/users/:id", adminAuth, deleteUser);
router.delete("/admin/users/:id/profile-pic", adminAuth, deleteProfilePic);
router.put("/admin/doctors/:id/verify", adminAuth, verifyDoctor);
router.get("/admin/patients", adminAuth, getPatients);
router.get("/admin/doctors", adminAuth, getDoctors); // Admin-specific doctor list
router.post("/admin/initial-admin", createInitialAdmin);

module.exports = router;
