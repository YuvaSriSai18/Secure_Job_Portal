// import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "User Management",
      description: "Add, remove, and manage user roles",
      path: "/admin/users",
    },
    {
      title: "Document Management",
      description: "View, download, or delete uploaded documents",
      path: "/admin/documents",
    },
    {
      title: "Job Management",
      description: "Create, update, or delete job posts",
      path: "/admin/jobs",
    },
    {
      title: "Applications for Jobs",
      description: "View Applications for Jobs",
      path: "/admin/job-applications",
    },
    // {
    //   title: "Audit Logs",
    //   description: "View system activity logs and events",
    //   path: "/admin/logs",
    // },
    {
      title: "Profile",
      description: "View and edit your profile",
      path: "/admin/profile",
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Card
            key={card.title}
            className="cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => navigate(card.path)}
          >
            <CardHeader>
              <CardTitle>{card.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
