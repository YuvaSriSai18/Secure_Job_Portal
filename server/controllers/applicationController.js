const Application = require("../models/Application");

exports.applyToJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    // prevent duplicate application
    const existing = await Application.findOne({ job: jobId, applicant: req.user.id });
    if (existing) return res.status(400).json({ message: "Already applied" });

    const app = await Application.create({
      job: jobId,
      applicant: req.user.id,
      status: "pending"
    });

    res.status(201).json(app);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error applying to job" });
  }
};

exports.getMyApplications = async (req, res) => {
  try {
    const apps = await Application.find({ applicant: req.user.id }).populate("job");
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: "Error fetching applications" });
  }
};

exports.getApplicationsForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const apps = await Application.find({ job: jobId }).populate("applicant", "email role");
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: "Error fetching job applications" });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // e.g. accepted, rejected, in-progress

    const app = await Application.findByIdAndUpdate(id, { status }, { new: true });
    if (!app) return res.status(404).json({ message: "Application not found" });

    res.json(app);
  } catch (err) {
    res.status(500).json({ message: "Error updating status" });
  }
};
