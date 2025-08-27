const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resumeUrl: { type: String },
    coverLetter: { type: String, default: "" },
    status: {
      type: String,
      enum: ["applied", "shortlisted", "rejected", "selected"],
      default: "applied",
    },
    feedback: { type: String, default: "" },
    interviewDate: { type: Date },
    attachments: [{ fileName: String, filePath: String, fileType: String }],
    appliedVia: {
      type: String,
      enum: ["web", "mobile", "email"],
      default: "web",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);
