// routes/applicationRoutes.js
const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/applicationController");
const { verifyToken, authorizeRoles } = require("../middlewares/auth");
const { UserRole } = require("../models/User");

// Candidate applies to a job
router.post(
  "/:jobId",
  verifyToken,
  authorizeRoles(UserRole.CANDIDATE),
  applicationController.applyToJob
);

// Candidate/Employee - view own applications
router.get(
  "/my",
  verifyToken,
  authorizeRoles(UserRole.CANDIDATE, UserRole.EMPLOYEE),
  applicationController.getMyApplications
);

// HR/Admin - view applications for a job
router.get(
  "/job/:jobId",
  verifyToken,
  authorizeRoles(UserRole.HR, UserRole.ADMIN),
  applicationController.getApplicationsForJob
);

// HR/Admin - update application status
router.patch(
  "/:id/status",
  verifyToken,
  authorizeRoles(UserRole.HR, UserRole.ADMIN),
  applicationController.updateApplicationStatus
);

module.exports = router;
