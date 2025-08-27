import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUserData } from "@/reducers/auth/authSlice";
import * as API from "@/apis/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface UserDocument {
  fileName: string;
  filePath: string;
  fileType: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface User {
  _id?: string;
  email: string;
  name: string;
  password?: string;
  role: "admin" | "hr" | "employee" | "candidate";
  emailVerified: boolean;
  lastLogin?: string;
  documents?: UserDocument[];
  createdAt?: string;
  updatedAt?: string;
}

export default function Profile() {
  const userData = useSelector(selectUserData);
  const [profile, setProfile] = useState<User | null>(null);
  const [documents, setDocuments] = useState<UserDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });

  // Fetch profile from API
  const fetchProfile = async () => {
    if (!userData?._id) return;
    try {
      setLoading(true);
      const res = await API.getUserById(userData?._id);
      setProfile(res.data);
      setDocuments(res.data.documents || []);
      setForm({ name: res.data.name, email: res.data.email });
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSave = async () => {
    if (!profile?._id) return;
    try {
      setLoading(true);
      await API.updateUserProfile(profile._id, form);
      setEditing(false);
      fetchProfile();
    } catch (err: any) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return <p className="p-6">Loading profile...</p>;
  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      {error && <p className="text-red-500">{error}</p>}

      {/* Basic Info */}
      <div className="bg-white p-4 rounded-md shadow space-y-3">
        <h3 className="text-xl font-semibold">Basic Info</h3>
        <div className="space-y-2">
          <div>
            <Label>Name</Label>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              readOnly={!editing}
              className={!editing ? "bg-gray-100 cursor-not-allowed" : ""}
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              name="email"
              value={form.email}
              onChange={handleChange}
              readOnly={!editing}
              className={!editing ? "bg-gray-100 cursor-not-allowed" : ""}
            />
          </div>
          <div>
            <Label>Role</Label>
            <Input value={profile.role} readOnly className="bg-gray-100 cursor-not-allowed" />
          </div>
          <div>
            <Label>Email Verified</Label>
            <Input
              value={profile.emailVerified ? "Yes" : "No"}
              readOnly
              className="bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div>
            <Label>Last Login</Label>
            <Input
              value={profile.lastLogin ? new Date(profile.lastLogin).toLocaleString() : "-"}
              readOnly
              className="bg-gray-100 cursor-not-allowed"
            />
          </div>

          {editing ? (
            <div className="flex gap-2">
              <Button onClick={handleSave}>Save</Button>
              <Button variant="destructive" onClick={() => setEditing(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <Button onClick={() => setEditing(true)}>Edit Profile</Button>
          )}
        </div>
      </div>

      {/* Documents */}
      <div className="bg-white p-4 rounded-md shadow space-y-2">
        <h3 className="text-xl font-semibold mb-2">Documents</h3>
        {documents.length === 0 ? (
          <p>No documents uploaded yet.</p>
        ) : (
          <ul className="space-y-1">
            {documents.map((doc) => (
              <li key={doc.filePath} className="flex justify-between items-center">
                <span>{doc.fileName}</span>
                <a
                  href={doc.filePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  View
                </a>
              </li>
            ))}
          </ul>
        )}
        <Button className="mt-2">Upload Document</Button>
      </div>
    </div>
  );
}
