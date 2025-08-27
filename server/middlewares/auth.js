const jwt = require("jsonwebtoken");
const { User, UserRole } = require("../models/User");
const Document = require("../models/Document");

const JWT_ACCESS_SECRET =  process.env.JWT_ACCESS_SECRET || "access_secret_change";


/**
 * Middleware: Role-based Access Control
 * Usage: authorizeRoles(UserRole.ADMIN, UserRole.HR)
 */
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user.id) return res.status(401).json({ message: "Not authorized" });
    if (!roles.includes(req.user.id.role)) {
      return res.status(403).json({ message: "Forbidden - insufficient role" });
    }
    next();
  };
};


exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded;
    console.log("req.user : " ,req.user.id)
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};
