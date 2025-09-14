

// const User = require("../models/UserModel");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const fs = require("fs").promises;
// const path = require("path");

// exports.registerUser = async (req, res) => {
//   try {
//     const { name, email, password, dob } = req.body;
//     console.log("Registering user:", { name, email, dob });
//     if (!name || !email || !password || !dob) {
//       throw new Error("All fields (name, email, password, dob) are required");
//     }
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       throw new Error("Email already exists");
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = new User({
//       name,
//       email,
//       password: hashedPassword,
//       dob,
//       role: "patient",
//     });
//     await user.save();
//     const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
//     console.log("User registered:", { email, role: user.role });
//     res.status(201).send({ user, token });
//   } catch (error) {
//     console.error("Register User Error:", error.message, error.stack);
//     res.status(400).send({ error: error.message });
//   }
// };

// exports.loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     console.log("Login attempt:", { email });
//     if (!email || !password) {
//       throw new Error("Email and password are required");
//     }
//     const user = await User.findOne({ email });
//     if (!user) {
//       console.log("User not found:", email);
//       throw new Error("Invalid login credentials");
//     }
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       console.log("Password mismatch for:", email);
//       throw new Error("Invalid login credentials");
//     }
//     const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
//     console.log("Login successful:", {
//       email,
//       role: user.role,
//       userId: user._id,
//     });
//     res.send({ user, token });
//   } catch (error) {
//     console.error("Login User Error:", error.message, error.stack);
//     res.status(400).send({ error: error.message });
//   }
// };

// exports.createUser = async (req, res) => {
//   try {
//     const {
//       name,
//       email,
//       password,
//       dob,
//       role,
//       specialty,
//       experience,
//       about,
//       appointmentFee,
//     } = req.body;
//     console.log("Creating user:", { name, email, role });
//     if (!["patient", "doctor", "admin"].includes(role)) {
//       throw new Error("Invalid role");
//     }
//     if (!name || !email || !password || !dob) {
//       throw new Error("Name, email, password, and dob are required");
//     }
//     if (role === "doctor" && (!specialty || !experience || !appointmentFee)) {
//       throw new Error(
//         "Specialty, experience, and appointmentFee are required for doctors"
//       );
//     }
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       throw new Error("Email already exists");
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const userData = {
//       name,
//       email,
//       password: hashedPassword,
//       dob,
//       role,
//       isVerified: role === "admin" ? true : role === "doctor" ? false : true,
//       status: "active",
//       specialty: role === "doctor" ? specialty : null,
//       experience: role === "doctor" ? experience : null,
//       about: role === "doctor" ? about : null,
//       appointmentFee: role === "doctor" ? appointmentFee : null,
//       profilePic: req.file ? `/Uploads/${req.file.filename}` : null,
//     };
//     const user = new User(userData);
//     await user.save();
//     console.log("User created:", { email, role, userId: user._id });
//     res.status(201).send({ user });
//   } catch (error) {
//     console.error("Create User Error:", error.message, error.stack);
//     res.status(400).send({ error: error.message });
//   }
// };

// exports.updateUser = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const {
//       name,
//       email,
//       password,
//       dob,
//       role,
//       specialty,
//       experience,
//       about,
//       appointmentFee,
//     } = req.body;
//     console.log("Updating user:", { id, name, email, role });
//     if (!["patient", "doctor", "admin"].includes(role)) {
//       throw new Error("Invalid role");
//     }
//     if (!name || !email || !dob) {
//       throw new Error("Name, email, and dob are required");
//     }
//     if (role === "doctor" && (!specialty || !experience || !appointmentFee)) {
//       throw new Error(
//         "Specialty, experience, and appointmentFee are required for doctors"
//       );
//     }
//     const user = await User.findById(id);
//     if (!user) {
//       throw new Error("User not found");
//     }
//     const updateData = {
//       name,
//       email,
//       dob,
//       role,
//       specialty: role === "doctor" ? specialty : null,
//       experience: role === "doctor" ? experience : null,
//       about: role === "doctor" ? about : null,
//       appointmentFee: role === "doctor" ? appointmentFee : null,
//     };
//     if (password) {
//       updateData.password = await bcrypt.hash(password, 10);
//     }
//     if (req.file) {
//       if (user.profilePic) {
//         await fs
//           .unlink(path.join(__dirname, "..", user.profilePic))
//           .catch((err) =>
//             console.error("Failed to delete old profile pic:", err)
//           );
//       }
//       updateData.profilePic = `/Uploads/${req.file.filename}`;
//     }
//     const updatedUser = await User.findByIdAndUpdate(id, updateData, {
//       new: true,
//     });
//     console.log("User updated:", { email, role, userId: id });
//     res.send({ user: updatedUser });
//   } catch (error) {
//     console.error("Update User Error:", error.message, error.stack);
//     res.status(400).send({ error: error.message });
//   }
// };

// exports.updateOwnProfile = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { name, dob } = req.body;
//     console.log("Updating own profile:", { userId, name, dob });

//     // Modified: Make name and dob optional if profilePic is provided
//     if (!name && !dob && !req.file) {
//       throw new Error(
//         "At least one field (name, dob, or profile picture) must be provided"
//       );
//     }

//     const user = await User.findById(userId);
//     if (!user) {
//       throw new Error("User not found");
//     }

//     const updateData = {};
//     if (name) updateData.name = name;
//     if (dob) updateData.dob = dob;
//     if (req.file) {
//       if (user.profilePic) {
//         await fs
//           .unlink(path.join(__dirname, "..", user.profilePic))
//           .catch((err) =>
//             console.error("Failed to delete old profile pic:", err)
//           );
//       }
//       updateData.profilePic = `/Uploads/${req.file.filename}`;
//     }

//     const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
//       new: true,
//     });
//     console.log("Own profile updated:", { userId, name: updateData.name });
//     res.send({ user: updatedUser });
//   } catch (error) {
//     console.error("Update Own Profile Error:", error.message, error.stack);
//     res.status(400).send({ error: error.message });
//   }
// };

// exports.deleteOwnProfilePic = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     console.log("Deleting own profile pic for user:", { userId });

//     const user = await User.findById(userId);
//     if (!user) {
//       throw new Error("User not found");
//     }
//     if (user.profilePic) {
//       await fs
//         .unlink(path.join(__dirname, "..", user.profilePic))
//         .catch((err) => console.error("Failed to delete profile pic:", err));
//       user.profilePic = null;
//       await user.save();
//     }
//     console.log("Own profile pic deleted:", { userId });
//     res.send({ user });
//   } catch (error) {
//     console.error("Delete Own Profile Pic Error:", error.message, error.stack);
//     res.status(400).send({ error: error.message });
//   }
// };

// exports.deleteUser = async (req, res) => {
//   try {
//     const { id } = req.params;
//     console.log("Deleting user:", { id });
//     const user = await User.findById(id);
//     if (!user) {
//       throw new Error("User not found");
//     }
//     if (user.profilePic) {
//       await fs
//         .unlink(path.join(__dirname, "..", user.profilePic))
//         .catch((err) => console.error("Failed to delete profile pic:", err));
//     }
//     await User.findByIdAndDelete(id);
//     console.log("User deleted:", { id });
//     res.send({ message: "User deleted successfully" });
//   } catch (error) {
//     console.error("Delete User Error:", error.message, error.stack);
//     res.status(400).send({ error: error.message });
//   }
// };

// exports.deleteProfilePic = async (req, res) => {
//   try {
//     const { id } = req.params;
//     console.log("Deleting profile pic for user:", { id });
//     const user = await User.findById(id);
//     if (!user) {
//       throw new Error("User not found");
//     }
//     if (user.profilePic) {
//       await fs
//         .unlink(path.join(__dirname, "..", user.profilePic))
//         .catch((err) => console.error("Failed to delete profile pic:", err));
//       user.profilePic = null;
//       await user.save();
//     }
//     console.log("Profile pic deleted:", { id });
//     res.send({ user });
//   } catch (error) {
//     console.error("Delete Profile Pic Error:", error.message, error.stack);
//     res.status(400).send({ error: error.message });
//   }
// };

// exports.verifyDoctor = async (req, res) => {
//   try {
//     const { id } = req.params;
//     console.log("Verifying doctor:", { id });
//     const doctor = await User.findByIdAndUpdate(
//       id,
//       { isVerified: true },
//       { new: true }
//     );
//     if (!doctor || doctor.role !== "doctor") {
//       throw new Error("Doctor not found");
//     }
//     console.log("Doctor verified:", { id, email: doctor.email });
//     res.send({ doctor });
//   } catch (error) {
//     console.error("Verify Doctor Error:", error.message, error.stack);
//     res.status(400).send({ error: error.message });
//   }
// };

// exports.createInitialAdmin = async (req, res) => {
//   try {
//     const { name, email, password, dob } = req.body;
//     console.log("Creating initial admin:", { name, email });
//     const existingAdmin = await User.findOne({ role: "admin" });
//     if (existingAdmin) {
//       throw new Error("Admin already exists");
//     }
//     if (!name || !email || !password || !dob) {
//       throw new Error("All fields (name, email, password, dob) are required");
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const admin = new User({
//       name,
//       email,
//       password: hashedPassword,
//       dob,
//       role: "admin",
//       isVerified: true,
//     });
//     await admin.save();
//     const token = jwt.sign({ _id: admin._id }, process.env.JWT_SECRET);
//     console.log("Initial admin created:", { email, role: admin.role });
//     res.status(201).send({ admin, token });
//   } catch (error) {
//     console.error("Create Initial Admin Error:", error.message, error.stack);
//     res.status(400).send({ error: error.message });
//   }
// };

// exports.getPatients = async (req, res) => {
//   try {
//     console.log("Fetching patients");
//     const patients = await User.find({ role: "patient" });
//     res.send({ patients });
//   } catch (error) {
//     console.error("Get Patients Error:", error.message, error.stack);
//     res.status(400).send({ error: error.message });
//   }
// };

// exports.getDoctors = async (req, res) => {
//   try {
//     console.log("Fetching doctors");
//     const doctors = await User.find({ role: "doctor" });
//     res.send({ doctors });
//   } catch (error) {
//     console.error("Get Doctors Error:", error.message, error.stack);
//     res.status(400).send({ error: error.message });
//   }
// };

// exports.getDoctor = async (req, res) => {
//   try {
//     const { id } = req.params;
//     console.log("Fetching doctor:", { id });
//     const doctor = await User.findById(id);
//     if (!doctor || doctor.role !== "doctor") {
//       throw new Error("Doctor not found");
//     }
//     res.send({ doctor });
//   } catch (error) {
//     console.error("Get Doctor Error:", error.message, error.stack);
//     res.status(404).send({ error: "Doctor not found" });
//   }
// };

// exports.getDoctorsBySpecialty = async (req, res) => {
//   try {
//     const { specialty, excludeId } = req.query;
//     console.log("Fetching doctors by specialty:", { specialty, excludeId });
//     if (!specialty) {
//       throw new Error("Specialty is required");
//     }
//     const query = {
//       role: "doctor",
//       specialty,
//       _id: { $ne: excludeId },
//     };
//     const doctors = await User.find(query).limit(5);
//     console.log(
//       "Related doctors fetched:",
//       doctors.map((d) => ({ id: d._id, name: d.name }))
//     );
//     res.send({ doctors });
//   } catch (error) {
//     console.error(
//       "Get Doctors By Specialty Error:",
//       error.message,
//       error.stack
//     );
//     res.status(400).send({ error: error.message });
//   }
// };


const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs").promises;
const path = require("path");

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, dob } = req.body;
    console.log("Registering user:", { name, email, dob });
    if (!name || !email || !password || !dob) {
      throw new Error("All fields (name, email, password, dob) are required");
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("Email already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      dob,
      role: "patient",
    });
    await user.save();
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    console.log("User registered:", { email, role: user.role });
    res.status(201).send({ user, token });
  } catch (error) {
    console.error("Register User Error:", error.message, error.stack);
    res.status(400).send({ error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt:", { email });
    if (!email || !password) {
      throw new Error("Email and password are required");
    }
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found:", email);
      throw new Error("Invalid login credentials");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password mismatch for:", email);
      throw new Error("Invalid login credentials");
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    console.log("Login successful:", {
      email,
      role: user.role,
      userId: user._id,
    });
    res.send({ user, token });
  } catch (error) {
    console.error("Login User Error:", error.message, error.stack);
    res.status(400).send({ error: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      dob,
      role,
      specialty,
      experience,
      about,
      appointmentFee,
    } = req.body;
    console.log("Creating user:", { name, email, role });
    if (!["patient", "doctor", "admin"].includes(role)) {
      throw new Error("Invalid role");
    }
    if (!name || !email || !password || !dob) {
      throw new Error("Name, email, password, and dob are required");
    }
    if (role === "doctor" && (!specialty || !experience || !appointmentFee)) {
      throw new Error(
        "Specialty, experience, and appointmentFee are required for doctors"
      );
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("Email already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = {
      name,
      email,
      password: hashedPassword,
      dob,
      role,
      isVerified: role === "admin" ? true : role === "doctor" ? false : true,
      status: "active",
      specialty: role === "doctor" ? specialty : null,
      experience: role === "doctor" ? experience : null,
      about: role === "doctor" ? about : null,
      appointmentFee: role === "doctor" ? appointmentFee : null,
      profilePic: req.file ? `/Uploads/${req.file.filename}` : null,
    };
    const user = new User(userData);
    await user.save();
    console.log("User created:", { email, role, userId: user._id });
    res.status(201).send({ user });
  } catch (error) {
    console.error("Create User Error:", error.message, error.stack);
    res.status(400).send({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      password,
      dob,
      role,
      specialty,
      experience,
      about,
      appointmentFee,
    } = req.body;
    console.log("Updating user:", { id, name, email, role });
    if (!["patient", "doctor", "admin"].includes(role)) {
      throw new Error("Invalid role");
    }
    if (!name || !email || !dob) {
      throw new Error("Name, email, and dob are required");
    }
    if (role === "doctor" && (!specialty || !experience || !appointmentFee)) {
      throw new Error(
        "Specialty, experience, and appointmentFee are required for doctors"
      );
    }
    const user = await User.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    const updateData = {
      name,
      email,
      dob,
      role,
      specialty: role === "doctor" ? specialty : null,
      experience: role === "doctor" ? experience : null,
      about: role === "doctor" ? about : null,
      appointmentFee: role === "doctor" ? appointmentFee : null,
    };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }
    if (req.file) {
      if (user.profilePic) {
        const filename = user.profilePic.replace(/^\/Uploads\//, "");
        const oldFilePath = path.join(__dirname, "..", "Uploads", filename);
        try {
          await fs.access(oldFilePath);
          await fs.unlink(oldFilePath);
          console.log("Old profile pic deleted:", oldFilePath);
        } catch (err) {
          console.error("Failed to delete old profile pic:", oldFilePath, err.message);
        }
      }
      updateData.profilePic = `/Uploads/${req.file.filename}`;
    }
    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    console.log("User updated:", { email, role, userId: id });
    res.send({ user: updatedUser });
  } catch (error) {
    console.error("Update User Error:", error.message, error.stack);
    res.status(400).send({ error: error.message });
  }
};

exports.updateOwnProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, dob } = req.body;
    console.log("Updating own profile:", { userId, name, dob });

    if (!name && !dob && !req.file) {
      throw new Error("At least one field (name, dob, or profile picture) must be provided");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (dob) updateData.dob = dob;
    if (req.file) {
      if (user.profilePic) {
        const filename = user.profilePic.replace(/^\/Uploads\//, "");
        const oldFilePath = path.join(__dirname, "..", "Uploads", filename);
        try {
          await fs.access(oldFilePath);
          await fs.unlink(oldFilePath);
          console.log("Old profile pic deleted:", oldFilePath);
        } catch (err) {
          console.error("Failed to delete old profile pic:", oldFilePath, err.message);
        }
      }
      updateData.profilePic = `/Uploads/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });
    console.log("Own profile updated:", { userId, name: updateData.name });
    res.send({ user: updatedUser });
  } catch (error) {
    console.error("Update Own Profile Error:", error.message, error.stack);
    res.status(400).send({ error: error.message });
  }
};

exports.deleteOwnProfilePic = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log("Deleting own profile pic for user:", { userId });

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    if (user.profilePic) {
      const filename = user.profilePic.replace(/^\/Uploads\//, "");
      const filePath = path.join(__dirname, "..", "Uploads", filename);
      try {
        await fs.access(filePath);
        await fs.unlink(filePath);
        console.log("Profile pic deleted:", filePath);
      } catch (err) {
        console.error("Failed to delete profile pic:", filePath, err.message);
      }
      user.profilePic = null;
      await user.save();
    }
    console.log("Own profile pic deleted:", { userId });
    res.send({ user });
  } catch (error) {
    console.error("Delete Own Profile Pic Error:", error.message, error.stack);
    res.status(400).send({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Deleting user:", { id });
    const user = await User.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    if (user.profilePic) {
      const filename = user.profilePic.replace(/^\/Uploads\//, "");
      const filePath = path.join(__dirname, "..", "Uploads", filename);
      try {
        await fs.access(filePath);
        await fs.unlink(filePath);
        console.log("Profile pic deleted:", filePath);
      } catch (err) {
        console.error("Failed to delete profile pic:", filePath, err.message);
      }
    }
    await User.findByIdAndDelete(id);
    console.log("User deleted:", { id });
    res.send({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete User Error:", error.message, error.stack);
    res.status(400).send({ error: error.message });
  }
};

exports.deleteProfilePic = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Deleting profile pic for user:", { id });
    const user = await User.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    if (user.profilePic) {
      const filename = user.profilePic.replace(/^\/Uploads\//, "");
      const filePath = path.join(__dirname, "..", "Uploads", filename);
      try {
        await fs.access(filePath);
        await fs.unlink(filePath);
        console.log("Profile pic deleted:", filePath);
      } catch (err) {
        console.error("Failed to delete profile pic:", filePath, err.message);
      }
      user.profilePic = null;
      await user.save();
    }
    console.log("Profile pic deleted:", { id });
    res.send({ user });
  } catch (error) {
    console.error("Delete Profile Pic Error:", error.message, error.stack);
    res.status(400).send({ error: error.message });
  }
};

exports.verifyDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Verifying doctor:", { id });
    const doctor = await User.findByIdAndUpdate(
      id,
      { isVerified: true },
      { new: true }
    );
    if (!doctor || doctor.role !== "doctor") {
      throw new Error("Doctor not found");
    }
    console.log("Doctor verified:", { id, email: doctor.email });
    res.send({ doctor });
  } catch (error) {
    console.error("Verify Doctor Error:", error.message, error.stack);
    res.status(400).send({ error: error.message });
  }
};

exports.createInitialAdmin = async (req, res) => {
  try {
    const { name, email, password, dob } = req.body;
    console.log("Creating initial admin:", { name, email });
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      throw new Error("Admin already exists");
    }
    if (!name || !email || !password || !dob) {
      throw new Error("All fields (name, email, password, dob) are required");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new User({
      name,
      email,
      password: hashedPassword,
      dob,
      role: "admin",
      isVerified: true,
    });
    await admin.save();
    const token = jwt.sign({ _id: admin._id }, process.env.JWT_SECRET);
    console.log("Initial admin created:", { email, role: admin.role });
    res.status(201).send({ admin, token });
  } catch (error) {
    console.error("Create Initial Admin Error:", error.message, error.stack);
    res.status(400).send({ error: error.message });
  }
};

exports.getPatients = async (req, res) => {
  try {
    console.log("Fetching patients");
    const patients = await User.find({ role: "patient" });
    res.send({ patients });
  } catch (error) {
    console.error("Get Patients Error:", error.message, error.stack);
    res.status(400).send({ error: error.message });
  }
};

exports.getDoctors = async (req, res) => {
  try {
    console.log("Fetching doctors");
    const doctors = await User.find({ role: "doctor" });
    res.send({ doctors });
  } catch (error) {
    console.error("Get Doctors Error:", error.message, error.stack);
    res.status(400).send({ error: error.message });
  }
};

exports.getDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Fetching doctor:", { id });
    const doctor = await User.findById(id);
    if (!doctor || doctor.role !== "doctor") {
      throw new Error("Doctor not found");
    }
    res.send({ doctor });
  } catch (error) {
    console.error("Get Doctor Error:", error.message, error.stack);
    res.status(404).send({ error: "Doctor not found" });
  }
};

exports.getDoctorsBySpecialty = async (req, res) => {
  try {
    const { specialty, excludeId } = req.query;
    console.log("Fetching doctors by specialty:", { specialty, excludeId });
    if (!specialty) {
      throw new Error("Specialty is required");
    }
    const query = { 
      role: "doctor", 
      specialty,
      _id: { $ne: excludeId }
    };
    const doctors = await User.find(query).limit(5);
    console.log("Related doctors fetched:", doctors.map(d => ({ id: d._id, name: d.name })));
    res.send({ doctors });
  } catch (error) {
    console.error("Get Doctors By Specialty Error:", error.message, error.stack);
    res.status(400).send({ error: error.message });
  }
};
