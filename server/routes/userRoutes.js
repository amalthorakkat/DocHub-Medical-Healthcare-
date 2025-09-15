const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getDoctor,
  getDoctors,
  getDoctorsBySpecialty,
  createUser,
  updateUser,
  deleteUser,
  deleteProfilePic,
  verifyDoctor,
  createInitialAdmin,
  getPatients,
  updateOwnProfile, // New import
  deleteOwnProfilePic, // New import
} = require("../controllers/authController");
const { auth, adminAuth } = require("../middlewares/auth");
const upload = require("../config/multerConfig");

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/doctors", getDoctors);
router.get("/doctor/:id", getDoctor);
router.get("/doctors-by-specialty", getDoctorsBySpecialty);

// Authenticated user routes
router.put("/me", auth, upload.single("profilePic"), updateOwnProfile); // New route
router.delete("/me/profile-pic", auth, deleteOwnProfilePic); // New route

// Admin routes
router.post("/admin/users", adminAuth, upload.single("profilePic"), createUser);
router.put(
  "/admin/users/:id",
  adminAuth,
  upload.single("profilePic"),
  updateUser
);
router.delete("/admin/users/:id", adminAuth, deleteUser);
router.delete("/admin/users/:id/profile-pic", adminAuth, deleteProfilePic);
router.put("/admin/doctors/:id/verify", adminAuth, verifyDoctor);
router.get("/admin/patients", adminAuth, getPatients);
router.get("/admin/doctors", adminAuth, getDoctors);
router.post("/admin/initial-admin", createInitialAdmin);

module.exports = router;
