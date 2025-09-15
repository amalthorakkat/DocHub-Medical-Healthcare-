const Appointment = require("../models/AppointmentModel");
const User = require("../models/UserModel");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.createAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, fee } = req.body;
    const patientId = req.user._id;
    console.log("Creating appointment:", {
      patientId,
      doctorId,
      date,
      time,
      fee,
    });

    if (!doctorId || !date || !time || !fee) {
      console.error("Missing required fields:", { doctorId, date, time, fee });
      throw new Error("Doctor ID, date, time, and fee are required");
    }

    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== "doctor") {
      console.error("Doctor not found or invalid role:", { doctorId, doctor });
      throw new Error("Doctor not found");
    }

    const appointment = new Appointment({
      patientId,
      doctorId,
      date,
      time,
      fee,
      status: "pending",
    });
    await appointment.save();
    console.log("Appointment created:", { id: appointment._id });
    res.status(201).send({ appointment });
  } catch (error) {
    console.error("Create Appointment Error:", {
      message: error.message,
      stack: error.stack,
      body: req.body,
      user: req.user,
    });
    res.status(400).send({ error: error.message });
  }
};

exports.getPendingAppointments = async (req, res) => {
  try {
    const patientId = req.user._id;
    console.log("Fetching pending appointments for:", { patientId });
    const appointments = await Appointment.find({
      patientId,
      status: "pending",
    }).populate(
      "doctorId",
      "name specialty profilePic appointmentFee experience"
    );
    console.log(
      "Fetched pending appointments:",
      JSON.stringify(appointments, null, 2)
    );
    res.send({ appointments });
  } catch (error) {
    console.error("Get Pending Appointments Error:", {
      message: error.message,
      stack: error.stack,
    });
    res.status(400).send({ error: error.message });
  }
};

exports.getConfirmedAppointments = async (req, res) => {
  try {
    const patientId = req.user._id;
    console.log("Fetching confirmed appointments for:", { patientId });
    const appointments = await Appointment.find({
      patientId,
      status: "confirmed",
    }).populate(
      "doctorId",
      "name specialty profilePic appointmentFee experience"
    );
    console.log(
      "Fetched confirmed appointments:",
      JSON.stringify(appointments, null, 2)
    );
    res.send({ appointments });
  } catch (error) {
    console.error("Get Confirmed Appointments Error:", {
      message: error.message,
      stack: error.stack,
    });
    res.status(400).send({ error: error.message });
  }
};

exports.getConfirmedAppointmentsCount = async (req, res) => {
  try {
    const patientId = req.user._id;
    console.log("Fetching confirmed appointments count for:", { patientId });
    const count = await Appointment.countDocuments({
      patientId,
      status: "confirmed",
    });
    console.log("Fetched confirmed appointments count:", { count });
    res.send({ count });
  } catch (error) {
    console.error("Get Confirmed Appointments Count Error:", {
      message: error.message,
      stack: error.stack,
    });
    res.status(400).send({ error: error.message });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Deleting appointment:", { id });
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      throw new Error("Appointment not found");
    }
    if (appointment.patientId.toString() !== req.user._id.toString()) {
      console.error("Unauthorized attempt:", { id, patientId: req.user._id });
      throw new Error("Unauthorized to delete this appointment");
    }
    await Appointment.findByIdAndDelete(id);
    console.log("Appointment deleted:", { id });
    res.send({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("Delete Appointment Error:", {
      message: error.message,
      stack: error.stack,
    });
    res.status(400).send({ error: error.message });
  }
};

exports.createCheckoutSession = async (req, res) => {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error(
        "STRIPE_SECRET_KEY is not defined in environment variables"
      );
    }

    const { appointmentId } = req.body;
    const patientId = req.user._id;
    console.log("Creating checkout session for:", { appointmentId, patientId });

    const appointment = await Appointment.findById(appointmentId).populate(
      "doctorId",
      "name appointmentFee"
    );
    if (!appointment) {
      console.error("Appointment not found:", { appointmentId });
      throw new Error("Appointment not found");
    }
    if (appointment.patientId.toString() !== patientId.toString()) {
      console.error("Unauthorized attempt:", { appointmentId, patientId });
      throw new Error("Unauthorized to pay for this appointment");
    }
    if (appointment.status !== "pending") {
      console.error("Invalid appointment status:", {
        appointmentId,
        status: appointment.status,
      });
      throw new Error("Appointment is not in pending status");
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Consultation with ${
                appointment.doctorId?.name || "Unknown Doctor"
              }`,
              description: `Appointment on ${appointment.date} at ${appointment.time}`,
            },
            unit_amount: appointment.fee * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:5173/my-appointments?session_id={CHECKOUT_SESSION_ID}&appointment_id=${appointmentId}`,
      cancel_url: `http://localhost:5173/my-appointments`,
      metadata: {
        appointmentId: appointmentId,
        patientId: patientId.toString(),
      },
    });

    console.log("Checkout session created:", {
      sessionId: session.id,
      appointmentId,
      status: appointment.status,
    });
    res.send({ sessionId: session.id });
  } catch (error) {
    console.error("Create Checkout Session Error:", {
      message: error.message,
      stack: error.stack,
      appointmentId: req.body.appointmentId,
      patientId,
    });
    res.status(400).send({ error: error.message });
  }
};

exports.confirmAppointment = async (req, res) => {
  const { appointmentId } = req.body;
  const patientId = req.user._id;
  try {
    console.log("Confirming appointment:", { appointmentId, patientId });

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      console.error("Appointment not found:", { appointmentId });
      throw new Error("Appointment not found");
    }
    if (appointment.patientId.toString() !== patientId.toString()) {
      console.error("Unauthorized attempt:", { appointmentId, patientId });
      throw new Error("Unauthorized to confirm this appointment");
    }
    if (appointment.status === "confirmed") {
      console.log("Appointment already confirmed:", {
        appointmentId,
        status: appointment.status,
      });
      const updatedAppointment = await Appointment.findById(
        appointmentId
      ).populate(
        "doctorId",
        "name specialty profilePic appointmentFee experience"
      );
      return res.send({ appointment: updatedAppointment });
    }
    if (appointment.status !== "pending") {
      console.error("Invalid appointment status:", {
        appointmentId,
        status: appointment.status,
      });
      throw new Error("Appointment is not in pending status");
    }

    appointment.status = "confirmed";
    await appointment.save();
    console.log("Appointment confirmed:", {
      id: appointment._id,
      status: appointment.status,
    });

    const updatedAppointment = await Appointment.findById(
      appointmentId
    ).populate(
      "doctorId",
      "name specialty profilePic appointmentFee experience"
    );
    res.send({ appointment: updatedAppointment });
  } catch (error) {
    console.error("Confirm Appointment Error:", {
      message: error.message,
      stack: error.stack,
      appointmentId,
      patientId,
    });
    res.status(400).send({ error: error.message });
  }
};
