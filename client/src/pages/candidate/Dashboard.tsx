// import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CandidateDashboard() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Jobs",
      description: "Browse and apply for jobs",
      path: "/candidate/jobs",
    },
    {
      title: "Applications",
      description: "View your applications and status",
      path: "/candidate/applications",
    },
    {
      title: "Documents",
      description: "Upload and manage your resumes",
      path: "/candidate/documents",
    },
    {
      title: "Profile",
      description: "View and edit your profile",
      path: "/candidate/profile",
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Candidate Dashboard
      </h1>
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
