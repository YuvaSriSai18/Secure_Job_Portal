// routes/applicationRoutes.js
const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/applicationController");
const { protect, authorizeRoles } = require("../middlewares/auth");
const { UserRole } = require("../models/User");

// Candidate applies to a job
router.post(
  "/:jobId",
  protect,
  authorizeRoles(UserRole.CANDIDATE),
  applicationController.applyToJob
);

// Candidate/Employee - view own applications
router.get(
  "/my",
  protect,
  authorizeRoles(UserRole.CANDIDATE, UserRole.EMPLOYEE),
  applicationController.getMyApplications
);

// HR/Admin - view applications for a job
router.get(
  "/job/:jobId",
  protect,
  authorizeRoles(UserRole.HR, UserRole.ADMIN),
  applicationController.getApplicationsForJob
);

// HR/Admin - update application status
router.patch(
  "/:id/status",
  protect,
  authorizeRoles(UserRole.HR, UserRole.ADMIN),
  applicationController.updateApplicationStatus
);

module.exports = router;
