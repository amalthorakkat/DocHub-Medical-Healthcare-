const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    console.log(
      "Auth Middleware - Received Token:",
      token ? "Present" : "Missing"
    );
    if (!token) {
      throw new Error("No token provided");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Auth Middleware - Decoded Token:", { _id: decoded._id });
    const user = await User.findOne({ _id: decoded._id });
    if (!user) {
      throw new Error("User not found");
    }
    req.token = token;
    req.user = user;
    console.log("Auth Middleware - User Authenticated:", { userId: user._id });
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message, error.stack);
    res.status(401).send({ error: error.message || "Please authenticate." });
  }
};

// Middleware to check admin role
const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {
      if (req.user.role !== "admin") {
        throw new Error("Admin access required");
      }
      next();
    });
  } catch (error) {
    res.status(403).send({ error: error.message });
  }
};

module.exports = { auth, adminAuth };
