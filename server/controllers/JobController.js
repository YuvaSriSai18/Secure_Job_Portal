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
};

module.exports = JobController;
