// import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EmployeeDashboard() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "My Documents",
      description: "View and download your uploaded documents",
      path: "/employee/documents",
    },
    {
      title: "Job Applications",
      description: "View jobs you applied for and track status",
      path: "/employee/applications",
    },
    {
      title: "Profile",
      description: "View and edit your profile details",
      path: "/employee/profile",
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Employee Dashboard
      </h1>
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
