// controllers/job.controller.js
const Job = require("../models/Jobs");

const JobController = {
  createJob: async (req, res) => {
    try {
      const job = await Job.create({ ...req.body, createdBy: req.user.id._id });
      res.status(201).json(job);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  updateJob: async (req, res) => {
    try {
      const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!job) return res.status(404).json({ message: "Job not found" });
      res.json(job);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  deleteJob: async (req, res) => {
    try {
      const job = await Job.findByIdAndDelete(req.params.id);
      if (!job) return res.status(404).json({ message: "Job not found" });
      res.json({ message: "Job deleted" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  getAllJobs: async (req, res) => {
    try {
      // Candidate should see only active jobs
      const filter = req.user.role === "candidate" ? { status: "active" } : {};
      const jobs = await Job.find(filter);
      res.json(jobs);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  getJobById: async (req, res) => {
    try {
      const job = await Job.findById(req.params.id);
      if (!job) return res.status(404).json({ message: "Job not found" });
      res.json(job);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  applyJob: async (req, res) => {
    try {
      if (req.user.id.role !== "candidate")
        return res
          .status(403)
          .json({ message: "Only candidates can apply to jobs" });

      const job = await Job.findById(req.params.id);
      if (!job) return res.status(404).json({ message: "Job not found" });

      const alreadyApplied = job.applications.some(
        (app) => app.candidate.toString() === req.user.id
      );
      if (alreadyApplied)
        return res.status(400).json({ message: "Already applied to this job" });

      job.applications.push({ candidate: req.user.id, appliedAt: new Date() });
      await job.save();

      res.json({ message: "Applied successfully" });
    } catch (err) {
      console.error("applyJob error:", err);
      res.status(500).json({ message: "Server error applying to job" });
    }
  },
};

module.exports = JobController;
