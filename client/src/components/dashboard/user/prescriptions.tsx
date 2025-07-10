"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { FaCalendarAlt, FaFileDownload, FaUserMd, FaHeartbeat } from "react-icons/fa";
import { format } from "date-fns";

const DUMMY_PRESCRIPTIONS = [
  {
    id: 1,
    doctor: {
      name: "Dr. Sarah Johnson",
      specialty: "Cardiology",
      avatar: "/avatars/doc1.png",
    },
    prescribedAt: "2024-12-15",
    validFrom: "2024-12-15",
    validUntil: "2024-12-22",
    appointmentType: "Ward Round",
    status: "active",
    notes:
      "Post-surgery cardiac medication regimen. Monitor blood pressure daily.",
  },
  {
    id: 2,
    doctor: {
      name: "Dr. Emily Chen",
      specialty: "Internal Medicine",
      avatar: "/avatars/doc2.png",
    },
    prescribedAt: "2024-12-12",
    validFrom: "2024-12-12",
    validUntil: "2024-12-19",
    appointmentType: "Scheduled Review",
    status: "fulfilled",
    notes:
      "Pain management and antibiotic course. Take with food to avoid stomach upset.",
  },
];

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  fulfilled: "bg-blue-100 text-blue-700",
  cancelled: "bg-red-100 text-red-700",
  expired: "bg-gray-100 text-gray-600",
};

export default function UserPrescriptions() {
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = DUMMY_PRESCRIPTIONS.filter((presc) => {
    const matchStatus = tab === "all" || presc.status === tab;
    const matchSearch =
      presc.doctor.name.toLowerCase().includes(search.toLowerCase()) ||
      presc.notes.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="min-h-screen p-6 max-w-5xl mx-auto text-zinc-800 dark:text-zinc-100">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">My Prescriptions</h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Review medications prescribed during your stay
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <FaFileDownload /> Download Summary
        </Button>
      </div>

      <div className="mb-4">
        <Input
          placeholder="Search medications..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-80"
        />
      </div>

      <Tabs defaultValue="all" onValueChange={setTab} className="mb-6">
        <TabsList className="flex gap-2">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="fulfilled">Fulfilled</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          <TabsTrigger value="expired">Expired</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-4">
        {filtered.map((presc) => (
          <div
            key={presc.id}
            className="bg-white dark:bg-zinc-900 p-5 rounded-xl shadow-md border border-zinc-100 dark:border-zinc-800"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={presc.doctor.avatar}
                  alt="Doctor Avatar"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h2 className="text-lg font-semibold">
                    {presc.doctor.name}
                  </h2>
                  <p className="text-sm text-zinc-500">
                    {presc.doctor.specialty}
                  </p>
                  <p className="text-sm text-zinc-400">
                    Prescribed: {format(new Date(presc.prescribedAt), "PPP")}
                  </p>
                </div>
              </div>
              <Badge className={statusColors[presc.status] || ""}>
                {presc.status.charAt(0).toUpperCase() + presc.status.slice(1)}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-sm text-zinc-600 dark:text-zinc-300">
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-zinc-400" />
                <span>
                  <strong>Valid From:</strong> {format(new Date(presc.validFrom), "PPP")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-zinc-400" />
                <span>
                  <strong>Valid Until:</strong> {format(new Date(presc.validUntil), "PPP")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FaHeartbeat className="text-zinc-400" />
                <span>
                  <strong>Appointment:</strong> {presc.appointmentType}
                </span>
              </div>
            </div>

            <div className="mt-4 text-sm text-zinc-700 dark:text-zinc-100">
              {presc.notes}
            </div>

            <div className="mt-4">
              <Button className="w-full sm:w-auto">View Details</Button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-zinc-500 text-center pt-10">
            No prescriptions found.
          </p>
        )}
      </div>
    </div>
  );
}
