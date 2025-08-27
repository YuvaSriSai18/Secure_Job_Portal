// routes/jobs.routes.js
const express = require("express");
const { verifyToken, authorizeRoles } = require("../middlewares/auth");
const JobController = require("../controllers/JobController");
const { UserRole } = require("../models/User");

const router = express.Router();

/**
 * 🔑 Roles
 * - Admin: Full CRUD (create, update, delete, view)
 * - HR: View jobs only
 * - Candidate: View + Apply
 */

// ================== ADMIN ROUTES ==================
router.post("/", verifyToken, authorizeRoles(UserRole.ADMIN), JobController.createJob);
router.patch("/:id", verifyToken, authorizeRoles(UserRole.ADMIN), JobController.updateJob);
router.delete("/:id", verifyToken, authorizeRoles(UserRole.ADMIN), JobController.deleteJob);

// ================== SHARED ROUTES (Admin + HR + Candidate) ==================
router.get("/", verifyToken, authorizeRoles(UserRole.ADMIN, UserRole.HR, UserRole.CANDIDATE), JobController.getAllJobs);
router.get("/:id", verifyToken, authorizeRoles(UserRole.ADMIN, UserRole.HR, UserRole.CANDIDATE), JobController.getJobById);

// ================== CANDIDATE ONLY ==================
router.post("/:id/apply", verifyToken, authorizeRoles(UserRole.CANDIDATE), JobController.applyJob);

module.exports = router;
