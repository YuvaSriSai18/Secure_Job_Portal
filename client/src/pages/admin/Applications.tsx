import React, { useEffect, useState } from "react";
import * as API from "@/apis/index";
import type { Job, User, Application } from "@/utils/types";
import { Button } from "@/components/ui/button";

export default function AdminApplications() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch jobs, users, and applications
  const fetchData = async () => {
    try {
      setLoading(true);
      const [jobsRes, usersRes] = await Promise.all([API.getAllJobs(), API.getAllUsers()]);
      setJobs(jobsRes.data);
      setUsers(usersRes.data);

      // Fetch applications for all jobs
      const allApps: Application[] = [];
      for (const job of jobsRes.data) {
        const res = await API.getApplicationsForJob(job._id!);
        allApps.push(...res.data);
      }
      setApplications(allApps);
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update application status
  const handleStatusChange = async (appId: string, status: string) => {
    try {
      const res = await API.updateApplicationStatus(appId, status);
      setApplications((prev) =>
        prev.map((app) => (app._id === appId ? { ...app, status: res.data.status } : app))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  if (loading) return <p className="p-6">Loading applications...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <h2 className="text-3xl font-bold text-center mb-6">Job Applications</h2>

      {jobs.map((job) => {
        const jobApps = applications.filter((app) => app.job === job._id);
        if (jobApps.length === 0) return null;

        return (
          <div key={job._id} className="bg-white rounded-lg shadow p-5">
            <h3 className="text-xl font-semibold mb-3">{job.title}</h3>

            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-3 py-2 text-left">Candidate Email</th>
                  <th className="border px-3 py-2 text-left">Status</th>
                  <th className="border px-3 py-2 text-left">Update Status</th>
                </tr>
              </thead>
              <tbody>
                {jobApps.map((app) => {
                  const candidate = users.find((u) => u._id === app.candidate);
                  return (
                    <tr key={app._id} className="hover:bg-gray-50">
                      <td className="border px-3 py-2">{candidate?.email || "N/A"}</td>
                      <td className="border px-3 py-2 capitalize">{app.status}</td>
                      <td className="border px-3 py-2">
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app._id!, e.target.value)}
                          className="border rounded px-2 py-1"
                        >
                          <option value="applied">Applied</option>
                          <option value="shortlisted">Shortlisted</option>
                          <option value="rejected">Rejected</option>
                          <option value="selected">Selected</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}
