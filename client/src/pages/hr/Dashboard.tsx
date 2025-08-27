// import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HRDashboard() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Job Management",
      description: "Post, edit, and manage job listings",
      path: "/hr/jobs",
    },
    {
      title: "Candidate Documents",
      description: "Upload and view candidate resumes or contracts",
      path: "/hr/documents",
    },
    {
      title: "Applications",
      description: "View applications and update statuses",
      path: "/hr/applications",
    },
    {
      title: "Profile",
      description: "View and update your profile",
      path: "/hr/profile",
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">HR Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
