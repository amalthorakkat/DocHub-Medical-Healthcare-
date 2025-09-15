const express = require("express");
const router = express.Router();
const {
  createAppointment,
  getPendingAppointments,
  getConfirmedAppointments,
  getConfirmedAppointmentsCount,
  deleteAppointment,
  createCheckoutSession,
  confirmAppointment,
} = require("../controllers/appointmentController");
const { auth } = require("../middlewares/auth");

router.use(auth);

router.post("/", createAppointment);
router.get("/pending", getPendingAppointments);
router.get("/confirmed", getConfirmedAppointments);
router.get("/confirmed/count", getConfirmedAppointmentsCount);
router.delete("/:id", deleteAppointment);
router.post("/create-checkout-session", createCheckoutSession);
router.post("/confirm", confirmAppointment);

module.exports = router;
