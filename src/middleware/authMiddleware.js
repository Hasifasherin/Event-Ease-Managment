const jwt = require("jsonwebtoken");
const User = require("../models/User");

/*
  AUTHENTICATION MIDDLEWARE
*/
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ 1. If Admin (from ENV)
    if (decoded.role === "admin") {
      req.user = {
        id: decoded.id,
        role: "admin",
        name: "Admin",
        email: process.env.ADMIN_EMAIL,
      };
      return next();
    }

    // ✅ 2. Normal DB user
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};

/*
  ROLE AUTHORIZATION MIDDLEWARE
*/
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Role '${req.user.role}' not permitted.`,
      });
    }
    next();
  };
};

/*
  OPTIONAL CLEAN SHORTCUTS
*/

exports.adminOnly = (req, res, next) => {
  if (req.user.role === "admin") return next();
  return res.status(403).json({ message: "Admin access only" });
};

exports.organizerOnly = (req, res, next) => {
  if (req.user.role === "organizer") return next();
  return res.status(403).json({ message: "Organizer access only" });
};