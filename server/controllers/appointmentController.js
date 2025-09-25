

// const Appointment = require("../models/AppointmentModel");
// const User = require("../models/UserModel");
// const Absence = require("../models/AbsenceModel");
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// exports.createAppointment = async (req, res) => {
//   try {
//     const { doctorId, date, time, fee } = req.body;
//     const patientId = req.user._id;
//     console.log("Creating appointment:", {
//       patientId,
//       doctorId,
//       date,
//       time,
//       fee,
//     });

//     if (!doctorId || !date || !time || !fee) {
//       console.error("Missing required fields:", { doctorId, date, time, fee });
//       throw new Error("Doctor ID, date, time, and fee are required");
//     }

//     const doctor = await User.findById(doctorId);
//     if (!doctor || doctor.role !== "doctor") {
//       console.error("Doctor not found or invalid role:", { doctorId, doctor });
//       throw new Error("Doctor not found");
//     }

//     const absence = await Absence.findOne({ doctorId, date });
//     if (absence) {
//       console.error("Doctor is absent on this date:", { doctorId, date });
//       throw new Error("Doctor is unavailable on the selected date");
//     }

//     const appointment = new Appointment({
//       patientId,
//       doctorId,
//       date,
//       time,
//       fee,
//       status: "pending",
//     });
//     await appointment.save();
//     console.log("Appointment created:", { id: appointment._id });
//     res.status(201).send({ appointment });
//   } catch (error) {
//     console.error("Create Appointment Error:", {
//       message: error.message,
//       stack: error.stack,
//       body: req.body,
//       user: req.user,
//     });
//     res.status(400).send({ error: error.message });
//   }
// };

// exports.getPendingAppointments = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const userRole = req.user.role; // Assuming role is stored in req.user
//     console.log("Fetching pending appointments for:", { userId, userRole });

//     let query;
//     let populateField;
//     if (userRole === "patient") {
//       query = { patientId: userId, status: "pending" };
//       populateField = "doctorId";
//     } else if (userRole === "doctor") {
//       query = { doctorId: userId, status: "pending" };
//       populateField = "patientId";
//     } else {
//       throw new Error("Invalid user role");
//     }

//     const appointments = await Appointment.find(query).populate(
//       populateField,
//       "name email profilePic specialty appointmentFee experience"
//     );
//     console.log(
//       "Fetched pending appointments:",
//       JSON.stringify(appointments, null, 2)
//     );
//     res.send({ appointments });
//   } catch (error) {
//     console.error("Get Pending Appointments Error:", {
//       message: error.message,
//       stack: error.stack,
//     });
//     res.status(400).send({ error: error.message });
//   }
// };

// exports.getConfirmedAppointments = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const userRole = req.user.role; // Assuming role is stored in req.user
//     console.log("Fetching confirmed appointments for:", { userId, userRole });

//     let query;
//     let populateField;
//     if (userRole === "patient") {
//       query = { patientId: userId, status: "confirmed" };
//       populateField = "doctorId";
//     } else if (userRole === "doctor") {
//       query = { doctorId: userId, status: "confirmed" };
//       populateField = "patientId";
//     } else {
//       throw new Error("Invalid user role");
//     }

//     const appointments = await Appointment.find(query).populate(
//       populateField,
//       "name email profilePic specialty appointmentFee experience"
//     );
//     console.log(
//       "Fetched confirmed appointments:",
//       JSON.stringify(appointments, null, 2)
//     );
//     res.send({ appointments });
//   } catch (error) {
//     console.error("Get Confirmed Appointments Error:", {
//       message: error.message,
//       stack: error.stack,
//     });
//     res.status(400).send({ error: error.message });
//   }
// };


// exports.getConfirmedAppointmentsCount = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const userRole = req.user.role; // Assuming role is stored in req.user
//     console.log("Fetching confirmed appointments count for:", {
//       userId,
//       userRole,
//     });

//     let query;
//     if (userRole === "patient") {
//       query = { patientId: userId, status: "confirmed" };
//     } else if (userRole === "doctor") {
//       query = { doctorId: userId, status: "confirmed" };
//     } else {
//       throw new Error("Invalid user role");
//     }

//     const count = await Appointment.countDocuments(query);
//     console.log("Fetched confirmed appointments count:", { count });
//     res.send({ count });
//   } catch (error) {
//     console.error("Get Confirmed Appointments Count Error:", {
//       message: error.message,
//       stack: error.stack,
//     });
//     res.status(400).send({ error: error.message });
//   }
// };

// exports.deleteAppointment = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const userId = req.user._id;
//     console.log("Deleting appointment:", { id, userId });
//     const appointment = await Appointment.findById(id);
//     if (!appointment) {
//       throw new Error("Appointment not found");
//     }
//     if (
//       appointment.patientId.toString() !== userId.toString() &&
//       appointment.doctorId.toString() !== userId.toString()
//     ) {
//       console.error("Unauthorized attempt:", { id, userId });
//       throw new Error("Unauthorized to delete this appointment");
//     }
//     await Appointment.findByIdAndDelete(id);
//     console.log("Appointment deleted:", { id });
//     res.send({ message: "Appointment deleted successfully" });
//   } catch (error) {
//     console.error("Delete Appointment Error:", {
//       message: error.message,
//       stack: error.stack,
//     });
//     res.status(400).send({ error: error.message });
//   }
// };

// exports.createCheckoutSession = async (req, res) => {
//   try {
//     if (!process.env.STRIPE_SECRET_KEY) {
//       throw new Error(
//         "STRIPE_SECRET_KEY is not defined in environment variables"
//       );
//     }

//     const { appointmentId } = req.body;
//     const patientId = req.user._id;
//     console.log("Creating checkout session for:", { appointmentId, patientId });

//     const appointment = await Appointment.findById(appointmentId).populate(
//       "doctorId",
//       "name appointmentFee"
//     );
//     if (!appointment) {
//       console.error("Appointment not found:", { appointmentId });
//       throw new Error("Appointment not found");
//     }
//     if (appointment.patientId.toString() !== patientId.toString()) {
//       console.error("Unauthorized attempt:", { appointmentId, patientId });
//       throw new Error("Unauthorized to pay for this appointment");
//     }
//     if (appointment.status !== "pending") {
//       console.error("Invalid appointment status:", {
//         appointmentId,
//         status: appointment.status,
//       });
//       throw new Error("Appointment is not in pending status");
//     }

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items: [
//         {
//           price_data: {
//             currency: "usd",
//             product_data: {
//               name: `Consultation with ${
//                 appointment.doctorId?.name || "Unknown Doctor"
//               }`,
//               description: `Appointment on ${appointment.date} at ${appointment.time}`,
//             },
//             unit_amount: appointment.fee * 100,
//           },
//           quantity: 1,
//         },
//       ],
//       mode: "payment",
//       success_url: `http://localhost:5173/my-appointments?session_id={CHECKOUT_SESSION_ID}&appointment_id=${appointmentId}`,
//       cancel_url: `http://localhost:5173/my-appointments`,
//       metadata: {
//         appointmentId: appointmentId,
//         patientId: patientId.toString(),
//       },
//     });

//     console.log("Checkout session created:", {
//       sessionId: session.id,
//       appointmentId,
//       status: appointment.status,
//     });
//     res.send({ sessionId: session.id });
//   } catch (error) {
//     console.error("Create Checkout Session Error:", {
//       message: error.message,
//       stack: error.stack,
//       appointmentId: req.body.appointmentId,
//       patientId,
//     });
//     res.status(400).send({ error: error.message });
//   }
// };

// exports.confirmAppointment = async (req, res) => {
//   const { appointmentId } = req.body;
//   const userId = req.user._id;
//   const userRole = req.user.role;
//   try {
//     console.log("Confirming appointment:", { appointmentId, userId, userRole });

//     const appointment = await Appointment.findById(appointmentId);
//     if (!appointment) {
//       console.error("Appointment not found:", { appointmentId });
//       throw new Error("Appointment not found");
//     }

//     // Allow confirmation if user is the patient or doctor associated with the appointment
//     if (
//       appointment.patientId.toString() !== userId.toString() &&
//       appointment.doctorId.toString() !== userId.toString()
//     ) {
//       console.error("Unauthorized attempt:", {
//         appointmentId,
//         userId,
//         userRole,
//       });
//       throw new Error("Unauthorized to confirm this appointment");
//     }

//     if (appointment.status === "confirmed") {
//       console.log("Appointment already confirmed:", {
//         appointmentId,
//         status: appointment.status,
//       });
//       const updatedAppointment = await Appointment.findById(
//         appointmentId
//       ).populate(
//         userRole === "patient" ? "doctorId" : "patientId",
//         "name email profilePic specialty appointmentFee experience"
//       );
//       return res.send({ appointment: updatedAppointment });
//     }

//     if (appointment.status !== "pending") {
//       console.error("Invalid appointment status:", {
//         appointmentId,
//         status: appointment.status,
//       });
//       throw new Error("Appointment is not in pending status");
//     }

//     appointment.status = "confirmed";
//     await appointment.save();
//     console.log("Appointment confirmed:", {
//       id: appointment._id,
//       status: appointment.status,
//     });

//     const updatedAppointment = await Appointment.findById(
//       appointmentId
//     ).populate(
//       userRole === "patient" ? "doctorId" : "patientId",
//       "name email profilePic specialty appointmentFee experience"
//     );
//     res.send({ appointment: updatedAppointment });
//   } catch (error) {
//     console.error("Confirm Appointment Error:", {
//       message: error.message,
//       stack: error.stack,
//       appointmentId,
//       userId,
//       userRole,
//     });
//     res.status(400).send({ error: error.message });
//   }
// };



const Appointment = require("../models/AppointmentModel");
const User = require("../models/UserModel");
const Absence = require("../models/AbsenceModel");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const nodemailer = require("nodemailer"); // Added for email sending functionality
const generateAppointmentConfirmationEmail = require("../templates/appointmentConfirmationEmail"); // Added to import email template

// Create a new appointment
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

    const absence = await Absence.findOne({ doctorId, date });
    if (absence) {
      console.error("Doctor is absent on this date:", { doctorId, date });
      throw new Error("Doctor is unavailable on the selected date");
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

// Fetch pending appointments for a user
exports.getPendingAppointments = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role; // Assuming role is stored in req.user
    console.log("Fetching pending appointments for:", { userId, userRole });

    let query;
    let populateField;
    if (userRole === "patient") {
      query = { patientId: userId, status: "pending" };
      populateField = "doctorId";
    } else if (userRole === "doctor") {
      query = { doctorId: userId, status: "pending" };
      populateField = "patientId";
    } else {
      throw new Error("Invalid user role");
    }

    const appointments = await Appointment.find(query).populate(
      populateField,
      "name email profilePic specialty appointmentFee experience"
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

// Fetch confirmed appointments for a user
exports.getConfirmedAppointments = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role; // Assuming role is stored in req.user
    console.log("Fetching confirmed appointments for:", { userId, userRole });

    let query;
    let populateField;
    if (userRole === "patient") {
      query = { patientId: userId, status: "confirmed" };
      populateField = "doctorId";
    } else if (userRole === "doctor") {
      query = { doctorId: userId, status: "confirmed" };
      populateField = "patientId";
    } else {
      throw new Error("Invalid user role");
    }

    const appointments = await Appointment.find(query).populate(
      populateField,
      "name email profilePic specialty appointmentFee experience"
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

// Get count of confirmed appointments
exports.getConfirmedAppointmentsCount = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role; // Assuming role is stored in req.user
    console.log("Fetching confirmed appointments count for:", {
      userId,
      userRole,
    });

    let query;
    if (userRole === "patient") {
      query = { patientId: userId, status: "confirmed" };
    } else if (userRole === "doctor") {
      query = { doctorId: userId, status: "confirmed" };
    } else {
      throw new Error("Invalid user role");
    }

    const count = await Appointment.countDocuments(query);
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

// Delete an appointment
exports.deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    console.log("Deleting appointment:", { id, userId });
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      throw new Error("Appointment not found");
    }
    if (
      appointment.patientId.toString() !== userId.toString() &&
      appointment.doctorId.toString() !== userId.toString()
    ) {
      console.error("Unauthorized attempt:", { id, userId });
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

// Create a Stripe checkout session for payment
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

// Added helper function to send confirmation email with imported HTML template
async function sendConfirmationEmail(appointment) {
  try {
    // Validate environment variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("Missing email configuration:", {
        emailUser: process.env.EMAIL_USER ? "Set" : "Not set",
        emailPass: process.env.EMAIL_PASS ? "Set" : "Not set",
      });
      throw new Error("Email configuration missing in environment variables");
    }

    // Validate recipient email
    if (!appointment.patientId?.email) {
      console.error("Invalid or missing patient email:", {
        appointmentId: appointment._id,
        patientId: appointment.patientId?._id,
        email: appointment.patientId?.email,
      });
      throw new Error("Patient email is missing or invalid");
    }

    // Log email attempt details
    console.log("Preparing to send confirmation email:", {
      appointmentId: appointment._id,
      to: appointment.patientId.email,
      patientName: appointment.patientId.name,
      doctorName: appointment.doctorId.name,
      fee: appointment.fee,
      date: appointment.date,
      time: appointment.time,
    });

    // Configure Nodemailer transporter using environment variables
    const transporter = nodemailer.createTransport({
      service: "gmail", // Using Gmail; could be replaced with SendGrid, etc.
      auth: {
        user: process.env.EMAIL_USER, // Email address from .env
        pass: process.env.EMAIL_PASS, // App password or email password from .env
      },
    });

    // Verify transporter connection
    await transporter.verify();
    console.log("Nodemailer transporter verified successfully");

    // Generate HTML email content using imported template
    const htmlTemplate = generateAppointmentConfirmationEmail(appointment);

    // Define email content with HTML template and fallback text
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: appointment.patientId.email,
      subject: "Your Appointment Has Been Successfully Booked",
      text: `Dear ${appointment.patientId.name},\n\nYour appointment has been successfully booked.\n\nDetails:\n- Patient Name: ${appointment.patientId.name}\n- Paid Amount: $${appointment.fee}\n- Appointed Date: ${appointment.date} at ${appointment.time}\n- Doctor: Dr. ${appointment.doctorId.name}\n\nThank you for booking with us!`, // Fallback for clients that don't support HTML
      html: htmlTemplate, // HTML template from imported function
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Confirmation email sent successfully:", {
      messageId: info.messageId,
      to: appointment.patientId.email,
    });
  } catch (error) {
    // Enhanced error logging for debugging
    console.error("Error sending confirmation email:", {
      message: error.message,
      stack: error.stack,
      appointmentId: appointment._id,
      patientEmail: appointment.patientId?.email,
      emailUser: process.env.EMAIL_USER ? "Set" : "Not set",
      emailPass: process.env.EMAIL_PASS ? "Set" : "Not set",
    });
  }
}

// Confirm an appointment and send confirmation email
exports.confirmAppointment = async (req, res) => {
  const { appointmentId } = req.body;
  const userId = req.user._id;
  const userRole = req.user.role;
  try {
    console.log("Confirming appointment:", { appointmentId, userId, userRole });

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      console.error("Appointment not found:", { appointmentId });
      throw new Error("Appointment not found");
    }

    // Allow confirmation if user is the patient or doctor associated with the appointment
    if (
      appointment.patientId.toString() !== userId.toString() &&
      appointment.doctorId.toString() !== userId.toString()
    ) {
      console.error("Unauthorized attempt:", {
        appointmentId,
        userId,
        userRole,
      });
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
        userRole === "patient" ? "doctorId" : "patientId",
        "name email profilePic specialty appointmentFee experience"
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

    // Update appointment status to confirmed
    appointment.status = "confirmed";
    await appointment.save();
    console.log("Appointment confirmed:", {
      id: appointment._id,
      status: appointment.status,
    });

    // Populate patient and doctor details for email
    const fullAppointment = await Appointment.findById(appointmentId)
      .populate("patientId", "name email")
      .populate("doctorId", "name");

    // Send confirmation email to the patient
    await sendConfirmationEmail(fullAppointment);

    // Return updated appointment with populated fields
    const updatedAppointment = await Appointment.findById(
      appointmentId
    ).populate(
      userRole === "patient" ? "doctorId" : "patientId",
      "name email profilePic specialty appointmentFee experience"
    );
    res.send({ appointment: updatedAppointment });
  } catch (error) {
    console.error("Confirm Appointment Error:", {
      message: error.message,
      stack: error.stack,
      appointmentId,
      userId,
      userRole,
    });
    res.status(400).send({ error: error.message });
  }
};
