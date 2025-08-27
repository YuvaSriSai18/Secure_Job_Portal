import React, { useEffect, useState } from "react";
import * as API from "@/apis/index";
import type { Job } from "@/utils/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSelector } from "react-redux";
import { selectUserData } from "@/reducers/auth/authSlice";

export default function AdminJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<Partial<Job>>({});
  const [editingJobId, setEditingJobId] = useState<string | null>(null);

  const userData = useSelector(selectUserData);

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

  useEffect(() => {
    fetchJobs();
  }, []);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    if (name === "salary") {
      setForm({ ...form, salary: Number(value) });
    } else if (name === "tags") {
      setForm({ ...form, tags: value.split(",").map((tag) => tag.trim()) });
    } else if (name === "isActive") {
      setForm({ ...form, isActive: checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Create or update job
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingJobId) {
        await API.updateJob(editingJobId, form as Job);
      } else {
        const jobToCreate = { ...form, postedBy: userData._id } as Job;
        await API.createJob(jobToCreate);
      }
      setForm({});
      setEditingJobId(null);
      fetchJobs();
    } catch (err: any) {
      setError(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  // Delete job
  const handleDelete = async (id: string) => {
    try {
      await API.deleteJob(id);
      fetchJobs();
    } catch (err: any) {
      setError(err.response?.data?.message || "Delete failed");
    }
  };

  // Edit job
  const handleEdit = (job: Job) => {
    setEditingJobId(job._id || null);
    setForm({
      ...job,
      tags: job.tags || [],
      salary: job.salary || 0,
      isActive: job.isActive ?? true,
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Jobs</h2>

      {/* Job Form */}
      <div className="mb-6 p-4 border rounded-md bg-white">
        <h3 className="text-xl font-semibold mb-2">
          {editingJobId ? "Edit Job" : "Create Job"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Label>Title</Label>
            <Input name="title" value={form.title || ""} onChange={handleChange} required />
          </div>
          <div>
            <Label>Description</Label>
            <textarea
              name="description"
              value={form.description || ""}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
            />
          </div>
          <div>
            <Label>Department</Label>
            <Input name="department" value={form.department || ""} onChange={handleChange} />
          </div>
          <div>
            <Label>Location</Label>
            <Input name="location" value={form.location || ""} onChange={handleChange} />
          </div>
          <div>
            <Label>Salary</Label>
            <Input type="number" name="salary" value={form.salary ?? ""} onChange={handleChange} />
          </div>
          <div>
            <Label>Job Type</Label>
            <select
              name="jobType"
              value={form.jobType || "full-time"}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
            >
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="internship">Internship</option>
            </select>
          </div>
          <div>
            <Label>Tags (comma separated)</Label>
            <Input name="tags" value={form.tags?.join(",") || ""} onChange={handleChange} />
          </div>
          <div>
            <Label>Experience Required</Label>
            <Input
              name="experienceRequired"
              value={form.experienceRequired || ""}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive ?? true}
              onChange={handleChange}
            />
            <Label>Active</Label>
          </div>
          <Button type="submit" className="mt-2">
            {editingJobId ? "Update Job" : "Create Job"}
          </Button>
        </form>
      </div>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {/* Jobs Table */}
      <div className="overflow-x-auto bg-white p-4 rounded-md border">
        <h3 className="text-xl font-semibold mb-2">All Jobs</h3>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border px-2 py-1">Title</th>
                <th className="border px-2 py-1">Department</th>
                <th className="border px-2 py-1">Location</th>
                <th className="border px-2 py-1">Salary</th>
                <th className="border px-2 py-1">Job Type</th>
                <th className="border px-2 py-1">Experience</th>
                <th className="border px-2 py-1">Active</th>
                <th className="border px-2 py-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job._id}>
                  <td className="border px-2 py-1">{job.title}</td>
                  <td className="border px-2 py-1">{job.department}</td>
                  <td className="border px-2 py-1">{job.location}</td>
                  <td className="border px-2 py-1">{job.salary}</td>
                  <td className="border px-2 py-1">{job.jobType}</td>
                  <td className="border px-2 py-1">{job.experienceRequired}</td>
                  <td className="border px-2 py-1">{job.isActive ? "Yes" : "No"}</td>
                  <td className="border px-2 py-1 flex gap-2">
                    <Button size="sm" onClick={() => handleEdit(job)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(job._id!)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
