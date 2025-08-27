import React, { useEffect, useState } from "react";
import * as API from "@/apis/index";
import { Button } from "@/components/ui/button";
import type { Job, UserDocument } from "@/utils/types";

export default function CandidateJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [documents, setDocuments] = useState<UserDocument[]>([]);
  const [selectedResumeUrl, setSelectedResumeUrl] = useState<string>("");

  // Fetch all jobs
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await API.getAllJobs();
      setJobs(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's uploaded documents
  const fetchDocuments = async () => {
    try {
      const res = await API.getMyDocuments(); // API to get uploaded documents
      setDocuments(res.data);
    } catch (err) {
      console.error("Failed to fetch documents:", err);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchDocuments();
  }, []);

  // Open modal
  const handleOpenModal = (jobId: string) => {
    setSelectedJobId(jobId);
    setSelectedResumeUrl(""); // reset previous selection
    setShowModal(true);
  };

  // Apply for a job with selected resume
  const handleApply = async () => {
    if (!selectedJobId || !selectedResumeUrl) {
      return alert("Please select a resume to apply");
    }

    try {
      await API.applyJob(selectedJobId, selectedResumeUrl);
      alert("Applied successfully ✅");
      setAppliedJobs((prev) => new Set(prev.add(selectedJobId)));
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Failed to apply");
    }
  };

  if (loading) return <p className="p-6">Loading jobs...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold mb-4 text-center">Available Jobs</h2>

      {jobs.length === 0 ? (
        <p className="text-center text-gray-500">No jobs available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white rounded-lg shadow p-5 hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-semibold">{job.title}</h3>
                  <span className="text-sm text-gray-500 capitalize">{job.jobType}</span>
                </div>
                {job.department && <p className="text-gray-700 mb-1"><strong>Department:</strong> {job.department}</p>}
                {job.location && <p className="text-gray-700 mb-1"><strong>Location:</strong> {job.location}</p>}
                {job.salary && <p className="text-gray-700 mb-1"><strong>Salary:</strong> ${job.salary}</p>}
                {job.experienceRequired && <p className="text-gray-700 mb-1"><strong>Experience:</strong> {job.experienceRequired}</p>}
                {job.tags && job.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 my-2">
                    {job.tags.map((tag) => (
                      <span key={tag} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">{tag}</span>
                    ))}
                  </div>
                )}
                {job.description && <p className="text-gray-600 text-sm mt-2 line-clamp-3">{job.description}</p>}
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="text-gray-400 text-sm">
                  Posted: {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "-"}
                </span>
                <Button
                  size="sm"
                  disabled={appliedJobs.has(job._id || "")}
                  onClick={() => job._id && handleOpenModal(job._id)}
                >
                  {appliedJobs.has(job._id || "") ? "Applied" : "Apply"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Select Resume</h3>
            {documents.length === 0 ? (
              <p className="text-gray-500">No documents uploaded yet.</p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {documents.map((doc) => (
                  <div key={doc.filePath} className="flex items-center justify-between border p-2 rounded">
                    <span className="truncate">{doc.fileName}</span>
                    <input
                      type="radio"
                      name="selectedResume"
                      value={doc.filePath}
                      checked={selectedResumeUrl === doc.filePath}
                      onChange={() => setSelectedResumeUrl(doc.filePath)}
                    />
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-end gap-2 mt-4">
              <Button onClick={() => setShowModal(false)} variant="destructive">Cancel</Button>
              <Button onClick={handleApply} disabled={!selectedResumeUrl}>Apply</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
