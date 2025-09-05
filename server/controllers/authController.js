// const User = require("../models/UserModel");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const fs = require("fs").promises;
// const path = require("path");

// exports.registerUser = async (req, res) => {
//   try {
//     const { name, email, password, dob } = req.body;
//     console.log("Registering user:", { name, email, dob }); // Debug
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
//     const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "1h",
//     });
//     console.log("User registered:", { email, role: user.role }); // Debug
//     res.status(201).send({ user, token });
//   } catch (error) {
//     console.error("Register User Error:", error.message, error.stack); // Enhanced logging
//     res.status(400).send({ error: error.message });
//   }
// };

// exports.loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     console.log("Login attempt:", { email }); // Debug
//     if (!email || !password) {
//       throw new Error("Email and password are required");
//     }
//     const user = await User.findOne({ email });
//     if (!user) {
//       console.log("User not found:", email); // Debug
//       throw new Error("Invalid login credentials");
//     }
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       console.log("Password mismatch for:", email); // Debug
//       throw new Error("Invalid login credentials");
//     }
//     const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "1h",
//     });
//     console.log("Login successful:", {
//       email,
//       role: user.role,
//       userId: user._id,
//     }); // Debug
//     res.send({ user, token });
//   } catch (error) {
//     console.error("Login User Error:", error.message, error.stack); // Enhanced logging
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
//     console.log("Creating user:", { name, email, role }); // Debug
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
//       profilePic: req.file ? `/uploads/${req.file.filename}` : null,
//     };
//     const user = new User(userData);
//     await user.save();
//     console.log("User created:", { email, role, userId: user._id }); // Debug
//     res.status(201).send({ user });
//   } catch (error) {
//     console.error("Create User Error:", error.message, error.stack); // Enhanced logging
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
//     console.log("Updating user:", { id, name, email, role }); // Debug
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
//       updateData.profilePic = `/uploads/${req.file.filename}`;
//     }
//     const updatedUser = await User.findByIdAndUpdate(id, updateData, {
//       new: true,
//     });
//     console.log("User updated:", { email, role, userId: id }); // Debug
//     res.send({ user: updatedUser });
//   } catch (error) {
//     console.error("Update User Error:", error.message, error.stack); // Enhanced logging
//     res.status(400).send({ error: error.message });
//   }
// };

// exports.deleteUser = async (req, res) => {
//   try {
//     const { id } = req.params;
//     console.log("Deleting user:", { id }); // Debug
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
//     console.log("User deleted:", { id }); // Debug
//     res.send({ message: "User deleted successfully" });
//   } catch (error) {
//     console.error("Delete User Error:", error.message, error.stack); // Enhanced logging
//     res.status(400).send({ error: error.message });
//   }
// };

// exports.deleteProfilePic = async (req, res) => {
//   try {
//     const { id } = req.params;
//     console.log("Deleting profile pic for user:", { id }); // Debug
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
//     console.log("Profile pic deleted:", { id }); // Debug
//     res.send({ user });
//   } catch (error) {
//     console.error("Delete Profile Pic Error:", error.message, error.stack); // Enhanced logging
//     res.status(400).send({ error: error.message });
//   }
// };

// exports.verifyDoctor = async (req, res) => {
//   try {
//     const { id } = req.params;
//     console.log("Verifying doctor:", { id }); // Debug
//     const doctor = await User.findByIdAndUpdate(
//       id,
//       { isVerified: true },
//       { new: true }
//     );
//     if (!doctor || doctor.role !== "doctor") {
//       throw new Error("Doctor not found");
//     }
//     console.log("Doctor verified:", { id, email: doctor.email }); // Debug
//     res.send({ doctor });
//   } catch (error) {
//     console.error("Verify Doctor Error:", error.message, error.stack); // Enhanced logging
//     res.status(400).send({ error: error.message });
//   }
// };

// exports.createInitialAdmin = async (req, res) => {
//   try {
//     const { name, email, password, dob } = req.body;
//     console.log("Creating initial admin:", { name, email }); // Debug
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
//     const token = jwt.sign({ _id: admin._id }, process.env.JWT_SECRET, {
//       expiresIn: "1h",
//     });
//     console.log("Initial admin created:", { email, role: admin.role }); // Debug
//     res.status(201).send({ admin, token });
//   } catch (error) {
//     console.error("Create Initial Admin Error:", error.message, error.stack); // Enhanced logging
//     res.status(400).send({ error: error.message });
//   }
// };

// exports.getPatients = async (req, res) => {
//   try {
//     console.log("Fetching patients"); // Debug
//     const patients = await User.find({ role: "patient" });
//     res.send({ patients });
//   } catch (error) {
//     console.error("Get Patients Error:", error.message, error.stack); // Enhanced logging
//     res.status(400).send({ error: error.message });
//   }
// };

// exports.getDoctors = async (req, res) => {
//   try {
//     console.log("Fetching doctors"); // Debug
//     const doctors = await User.find({ role: "doctor" });
//     res.send({ doctors });
//   } catch (error) {
//     console.error("Get Doctors Error:", error.message, error.stack); // Enhanced logging
//     res.status(400).send({ error: error.message });
//   }
// };

// exports.getDoctor = async (req, res) => {
//   try {
//     const { id } = req.params;
//     console.log("Fetching doctor:", { id }); // Debug
//     const doctor = await User.findById(id);
//     if (!doctor || doctor.role !== "doctor") {
//       throw new Error("Doctor not found");
//     }
//     res.send({ doctor });
//   } catch (error) {
//     console.error("Get Doctor Error:", error.message, error.stack); // Enhanced logging
//     res.status(404).send({ error: "Doctor not found" });
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
    console.log("Registering user:", { name, email, dob }); // Debug
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
    console.log("User registered:", { email, role: user.role }); // Debug
    res.status(201).send({ user, token });
  } catch (error) {
    console.error("Register User Error:", error.message, error.stack);
    res.status(400).send({ error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt:", { email }); // Debug
    if (!email || !password) {
      throw new Error("Email and password are required");
    }
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found:", email); // Debug
      throw new Error("Invalid login credentials");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password mismatch for:", email); // Debug
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
    console.log("Creating user:", { name, email, role }); // Debug
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
      profilePic: req.file ? `/uploads/${req.file.filename}` : null,
    };
    const user = new User(userData);
    await user.save();
    console.log("User created:", { email, role, userId: user._id }); // Debug
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
    console.log("Updating user:", { id, name, email, role }); // Debug
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
        await fs
          .unlink(path.join(__dirname, "..", user.profilePic))
          .catch((err) =>
            console.error("Failed to delete old profile pic:", err)
          );
      }
      updateData.profilePic = `/uploads/${req.file.filename}`;
    }
    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    console.log("User updated:", { email, role, userId: id }); // Debug
    res.send({ user: updatedUser });
  } catch (error) {
    console.error("Update User Error:", error.message, error.stack);
    res.status(400).send({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Deleting user:", { id }); // Debug
    const user = await User.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    if (user.profilePic) {
      await fs
        .unlink(path.join(__dirname, "..", user.profilePic))
        .catch((err) => console.error("Failed to delete profile pic:", err));
    }
    await User.findByIdAndDelete(id);
    console.log("User deleted:", { id }); // Debug
    res.send({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete User Error:", error.message, error.stack);
    res.status(400).send({ error: error.message });
  }
};

exports.deleteProfilePic = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Deleting profile pic for user:", { id }); // Debug
    const user = await User.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    if (user.profilePic) {
      await fs
        .unlink(path.join(__dirname, "..", user.profilePic))
        .catch((err) => console.error("Failed to delete profile pic:", err));
      user.profilePic = null;
      await user.save();
    }
    console.log("Profile pic deleted:", { id }); // Debug
    res.send({ user });
  } catch (error) {
    console.error("Delete Profile Pic Error:", error.message, error.stack);
    res.status(400).send({ error: error.message });
  }
};

exports.verifyDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Verifying doctor:", { id }); // Debug
    const doctor = await User.findByIdAndUpdate(
      id,
      { isVerified: true },
      { new: true }
    );
    if (!doctor || doctor.role !== "doctor") {
      throw new Error("Doctor not found");
    }
    console.log("Doctor verified:", { id, email: doctor.email }); // Debug
    res.send({ doctor });
  } catch (error) {
    console.error("Verify Doctor Error:", error.message, error.stack);
    res.status(400).send({ error: error.message });
  }
};

exports.createInitialAdmin = async (req, res) => {
  try {
    const { name, email, password, dob } = req.body;
    console.log("Creating initial admin:", { name, email }); // Debug
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
    console.log("Initial admin created:", { email, role: admin.role }); // Debug
    res.status(201).send({ admin, token });
  } catch (error) {
    console.error("Create Initial Admin Error:", error.message, error.stack);
    res.status(400).send({ error: error.message });
  }
};

exports.getPatients = async (req, res) => {
  try {
    console.log("Fetching patients"); // Debug
    const patients = await User.find({ role: "patient" });
    res.send({ patients });
  } catch (error) {
    console.error("Get Patients Error:", error.message, error.stack);
    res.status(400).send({ error: error.message });
  }
};

exports.getDoctors = async (req, res) => {
  try {
    console.log("Fetching doctors"); // Debug
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
    console.log("Fetching doctor:", { id }); // Debug
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
