import axios,{ AxiosResponse } from "axios";
import type { userData, Job, User , Application } from "@/utils/types";

const API = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URI,
  withCredentials: true,
});

// Utility to get token dynamically
const getAuthHeader = () => {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ---- Auth ----
export const register = async (userData: userData) =>
  await API.post("/api/auth/register", userData);

export const login = async (userData: userData) =>
  await API.post("/api/auth/login", userData);

export const logout = async () =>
  await API.post("/api/auth/logout");

// ---- Jobs APIs ----
export const getAllJobs = async () =>
  await API.get("/api/job", { headers: getAuthHeader() });

export const getJobById = async (id: string) =>
  await API.get(`/api/job/${id}`, { headers: getAuthHeader() });

export const createJob = async (jobData: Job) =>
  await API.post("/api/job", jobData, { headers: getAuthHeader() });

export const updateJob = async (id: string, jobData: Job) =>
  await API.patch(`/api/job/${id}`, jobData, { headers: getAuthHeader() });

export const deleteJob = async (id: string) =>
  await API.delete(`/api/job/${id}`, { headers: getAuthHeader() });

export const applyJob = async (jobId: string, resumeUrl?: string) =>
  await API.post(`/api/application/${jobId}`, { resumeUrl }, { headers: getAuthHeader() });

// ---- Users APIs ----
export const getAllUsers = async () =>
  await API.get("/api/user", { headers: getAuthHeader() });

export const getUserById = async (id: string) =>
  await API.get(`/api/user/${id}`, { headers: getAuthHeader() });

export const updateUserRole = async (id: string, body: { role: string }) =>
  await API.patch(`/api/user/${id}/role`, body, { headers: getAuthHeader() });

export const deleteUser = async (id: string) =>
  await API.delete(`/api/user/${id}`, { headers: getAuthHeader() });

// Update current user's profile
export const updateUserProfile = async (userId: string, data: Partial<User>) =>
  await API.patch(`/api/user/${userId}`, data, {
    headers: getAuthHeader(),
  });
// ---- Document APIs ----
export const uploadDocument = async (doc: {
  fileName: string;
  filePath: string;
  mimeType: string;
}) => {
  return await API.post("/api/document/upload", doc, { headers: getAuthHeader() });
};

export const getMyDocuments = async () => {
  return await API.get("/api/document/my", { headers: getAuthHeader() });
};

export const getDocument = async (id: string) => {
  return await API.get(`/api/document/${id}`, { headers: getAuthHeader() });
};

export const deleteDocument = async (id: string) => {
  return await API.delete(`/api/document/${id}`, { headers: getAuthHeader() });
};

// Appication APIs

export const getMyApplications = async (): Promise<AxiosResponse<Application[]>> =>
  await API.get("/api/application/my", { headers: getAuthHeader() });

export const getApplicationsForJob = async (jobId: string): Promise<AxiosResponse<Application[]>> =>
  await API.get(`/api/application/job/${jobId}`, { headers: getAuthHeader() });

export const updateApplicationStatus = async (id: string, status: string) =>
  await API.patch(`/api/application/${id}/status`, { status }, { headers: getAuthHeader() });