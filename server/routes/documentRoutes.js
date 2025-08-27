const express = require("express");
const router = express.Router();
const documentController = require("../controllers/documentController");
const { protect, authorizeRoles } = require("../middlewares/auth");
const { UserRole } = require("../models/User");

// Upload document → (Candidate/Employee/HR/Admin)
router.post(
  "/upload",
  protect,
  authorizeRoles(UserRole.CANDIDATE, UserRole.EMPLOYEE, UserRole.HR, UserRole.ADMIN),
  documentController.uploadDocument
);

// Get my documents
router.get(
  "/my",
  protect,
  authorizeRoles(UserRole.CANDIDATE, UserRole.EMPLOYEE, UserRole.HR, UserRole.ADMIN),
  documentController.getMyDocuments
);

// Download/Preview document
router.get(
  "/:id",
  protect,
  authorizeRoles(UserRole.CANDIDATE, UserRole.EMPLOYEE, UserRole.HR, UserRole.ADMIN),
  documentController.getDocument
);

// Delete document → (Owner / HR / Admin)
router.delete(
  "/:id",
  protect,
  authorizeRoles(UserRole.CANDIDATE, UserRole.EMPLOYEE, UserRole.HR, UserRole.ADMIN),
  documentController.deleteDocument
);

module.exports = router;
