import { useEffect, useState } from "react";
import * as API from "@/apis/index";
import type { Application, Job } from "@/utils/types";

export default function EmployeeApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch employee's applications
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await API.getMyApplications();
      setApplications(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch your applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  if (loading) return <p className="p-6">Loading your applications...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold text-center mb-6">My Job Applications</h2>

      {applications.length === 0 ? (
        <p className="text-center text-gray-500">You have not applied to any jobs yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {applications.map((app) => {
            const job = app.job as unknown as Job; // Type assertion after population

            return (
              <div
                key={app._id}
                className="bg-white rounded-lg shadow p-5 hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xl font-semibold mb-2">{job?.title || "Job Title"}</h3>
                  <p className="text-gray-700 mb-1">
                    <strong>Status:</strong>{" "}
                    <span
                      className={`capitalize font-semibold ${
                        app.status === "applied"
                          ? "text-gray-500"
                          : app.status === "shortlisted"
                          ? "text-blue-600"
                          : app.status === "rejected"
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {app.status}
                    </span>
                  </p>
                  {/* {job.company && (
                    <p className="text-gray-700 mb-1">
                      <strong>Company:</strong> {job.company}
                    </p>
                  )} */}
                  {job.location && (
                    <p className="text-gray-700 mb-1">
                      <strong>Location:</strong> {job.location}
                    </p>
                  )}
                  {job.jobType && (
                    <p className="text-gray-700 mb-1">
                      <strong>Type:</strong> {job.jobType}
                    </p>
                  )}
                </div>
                <div className="mt-3 text-gray-400 text-sm">
                  Applied on: {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "-"}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
