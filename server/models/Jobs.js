const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    department: { type: String, default: "" },
    location: { type: String, default: "" },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: { type: Boolean, default: true },
    salary: { type: Number },
    tags: [{ type: String }],
    experienceRequired: { type: String, default: "" },
    jobType: {
      type: String,
      enum: ["full-time", "part-time", "internship"],
      default: "full-time",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
