// routes/AppRoutes.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "@/pages/admin/Dashboard";

import EmployeeDashboard from "@/pages/employee/Dashboard";
import CandidateDashboard from "@/pages/candidate/Dashboard";
import HRDashboard from "@/pages/hr/Dashboard";

import Profile from "@/pages/common/Profile";

import ProtectedRoute from "@/components/layout/ProtectedRoute";
import Login_Page from "@/pages/auth/Login_Page";
import CandidateJobs from "@/pages/candidate/Jobs";
import CandidateApplications from "@/pages/candidate/Applications";
import CandidateDocuments from "@/pages/candidate/Documents";
import HRJobs from "@/pages/hr/Jobs";
import HRDocs from "@/pages/hr/Docs";
import HRApplications from "@/pages/hr/Applications";
import AdminUsers from "@/pages/admin/Users";
import AdminDocs from "@/pages/admin/Docs";
import AdminJobs from "@/pages/admin/Jobs";
import EmployeeDocuments from "@/pages/employee/Documents";
import EmployeeApplications from "@/pages/employee/Applications";
import AdminApplications from "@/pages/admin/Applications";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Auth */}
      <Route path="/login" element={<Login_Page />} />

      {/* Admin */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/documents" element={<AdminDocs />} />
        <Route path="/admin/jobs" element={<AdminJobs />} />
        <Route path="/admin/profile" element={<Profile />} />
        <Route path="/admin/job-applications" element={<AdminApplications />} />
      </Route>

      {/* HR */}
      <Route element={<ProtectedRoute allowedRoles={["hr"]} />}>
        <Route path="/hr/*" element={<HRDashboard />} />
        <Route path="/hr/jobs" element={<HRJobs />} />
        <Route path="/hr/documents" element={<HRDocs />} />
        <Route path="/hr/applications" element={<HRApplications />} />
        <Route path="/hr/profile" element={<Profile />} />
      </Route>

      {/* Employee */}
      <Route element={<ProtectedRoute allowedRoles={["employee"]} />}>
        <Route path="/employee/*" element={<EmployeeDashboard />} />
        <Route path="/employee/documents" element={<EmployeeDocuments />} />
        <Route path="/employee/applications" element={<EmployeeApplications />} />
        <Route path="/employee/profile" element={<Profile />} />
      </Route>

      {/* Candidate */}
      <Route element={<ProtectedRoute allowedRoles={["candidate"]} />}>
        <Route path="/candidate/*" element={<CandidateDashboard />} />
        <Route path="/candidate/jobs" element={<CandidateJobs />} />
        <Route path="/candidate/documents" element={<CandidateDocuments />} />
        <Route path="/candidate/profile" element={<Profile />} />
        <Route path="/candidate/applications" element={<CandidateApplications />} />
      </Route>

      {/* Profile (common) */}
      <Route
        element={
          <ProtectedRoute
            allowedRoles={["admin", "hr", "employee", "candidate"]}
          />
        }
      >
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Default */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
