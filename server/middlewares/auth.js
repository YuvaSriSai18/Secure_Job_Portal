const jwt = require("jsonwebtoken");
const { User, UserRole } = require("../models/User");
const Document = require("../models/Document");

const JWT_ACCESS_SECRET =
  process.env.JWT_ACCESS_SECRET || "access_secret_change";

/**
 * Middleware: Protect routes with JWT
 */
exports.protect = async (req, res, next) => {
  let token = null;

  // Accept token from Authorization header or cookie
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token)
    return res.status(401).json({ message: "Not authorized, token missing" });

  try {
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET);

    const user = await User.findById(decoded.id).select(
      "-password -refreshToken"
    );
    if (!user)
      return res
        .status(401)
        .json({ message: "Not authorized, user not found" });

    req.user = { id: user._id.toString(), role: user.role };
    next();
  } catch (err) {
    console.error("Auth protect error:", err);
    return res.status(401).json({ message: "Not authorized, token invalid" });
  }
};

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

/**
 * Middleware: Document Access Control
 * Only document owner OR HR/Admin can access
 */
exports.canAccessDocument = async (req, res, next) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    const user = req.user; // set by protect()

    // Owner access
    if (doc.owner.toString() === user.id) return next();

    // HR/Admin access
    if ([UserRole.HR, UserRole.ADMIN].includes(user.role)) return next();

    return res.status(403).json({ message: "Forbidden" });
  } catch (err) {
    console.error("Doc access error:", err);
    return res.status(500).json({ message: "Server error" });
  }
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
