const Absence = require("../models/AbsenceModel");

exports.createAbsence = async (req, res) => {
  try {
    const { date } = req.body;
    const doctorId = req.user._id;
    console.log("Creating absence:", { doctorId, date });

    if (!date) {
      throw new Error("Date is required");
    }

    if (req.user.role !== "doctor") {
      throw new Error("Only doctors can mark absences");
    }

    const existingAbsence = await Absence.findOne({ doctorId, date });
    if (existingAbsence) {
      throw new Error("Absence already marked for this date");
    }

    const absence = new Absence({ doctorId, date });
    await absence.save();
    console.log("Absence created:", { id: absence._id, date });
    res.status(201).send({ absence });
  } catch (error) {
    console.error("Create Absence Error:", {
      message: error.message,
      stack: error.stack,
    });
    res.status(400).send({ error: error.message });
  }
};

exports.getAbsences = async (req, res) => {
  try {
    const doctorId = req.query.doctorId || req.user._id; // Use query param or user ID
    console.log("Fetching absences for:", { doctorId });
    const absences = await Absence.find({ doctorId });
    console.log("Fetched absences:", absences);
    res.send({ absences });
  } catch (error) {
    console.error("Get Absences Error:", {
      message: error.message,
      stack: error.stack,
    });
    res.status(400).send({ error: error.message });
  }
};

exports.deleteAbsence = async (req, res) => {
  try {
    const { id } = req.params;
    const doctorId = req.user._id;
    console.log("Deleting absence:", { id, doctorId });

    const absence = await Absence.findById(id);
    if (!absence) {
      throw new Error("Absence not found");
    }
    if (absence.doctorId.toString() !== doctorId.toString()) {
      throw new Error("Unauthorized to delete this absence");
    }

    await Absence.findByIdAndDelete(id);
    console.log("Absence deleted:", { id });
    res.send({ message: "Absence deleted successfully" });
  } catch (error) {
    console.error("Delete Absence Error:", {
      message: error.message,
      stack: error.stack,
    });
    res.status(400).send({ error: error.message });
  }
};
