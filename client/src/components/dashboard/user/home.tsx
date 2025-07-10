"use client";

import React from "react";
import {
  FaCalendarPlus,
  FaPills,
  FaFileMedicalAlt,
  FaMoneyBillWave,
  FaFlask,
  FaCalendarCheck,
  FaRobot,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaInfoCircle,
} from "react-icons/fa";
import { useStore } from "@tanstack/react-store";
import { authStore } from "@/store/authstore";
import { useUsersStoreActions } from "@/store/userstore";
import { useAppointmentsStoreActions } from "@/store/appointmentstore";
import { useLabTestStoreActions } from "@/store/labteststore";

const UserDashboardHome: React.FC = () => {
  const { userId } = useStore(authStore);

  if (!userId) {
    return (
      <div className="flex justify-center items-center min-h-screen text-zinc-500">
        Loading session...
      </div>
    );
  }

  const { getUserById } = useUsersStoreActions();
  const userQuery:any = getUserById(userId);
  const user = userQuery.data?.user;

  const { appointments: resp } = useAppointmentsStoreActions(userId ?? undefined);
  const appointments = (resp as any)?.data ?? [];

  const { labTests: labTestsWrapper } = useLabTestStoreActions(userId ?? undefined);
  const labTests = (labTestsWrapper as any)?.data ?? [];

  // Filter confirmed appointments
  const confirmedAppointments = appointments.filter((appt:any) => appt.status === "confirmed");

  const medications =
    user?.patientPrescriptions?.map((prescription:any) => ({
      id: prescription.id,
      name: prescription.medicationName,
      dosage: prescription.dosage,
      instruction: prescription.instructions,
      status: prescription.daysLeft < 3 ? "refillNeeded" : "normal",
      daysLeft: prescription.daysLeft,
    })) ?? [];

  const labResults =
    labTests
      .filter((test:any) => test.result) 
      .map((test:any) => ({
        id: test.result.id,
        parameterName: test.result.parameterName,
        resultValue: test.result.resultValue,
        unit: test.result.unit,
        referenceRange: test.result.referenceRange,
        abnormalFlag: test.result.abnormalFlag,
        notes: test.result.notes,
      })) ?? [];

  const statusMap = {
    confirmed: { label: "Confirmed", color: "text-blue-500", icon: <FaCheckCircle /> },
  };

  return (
    <div className="max-w-7xl p-6 font-sans min-h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
      {/* Quick Actions */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
        {[
          { icon: <FaCalendarPlus className="text-blue-600 text-2xl" />, label: "Book Appointment" },
          { icon: <FaPills className="text-green-600 text-2xl" />, label: "Order Medicine" },
          { icon: <FaFileMedicalAlt className="text-yellow-600 text-2xl" />, label: "View Reports" },
          { icon: <FaMoneyBillWave className="text-red-600 text-2xl" />, label: "Pay Bills" },
        ].map((action, index) => (
          <button
            key={index}
            className="flex flex-col items-center justify-center space-y-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg shadow p-4 hover:shadow-md transition-shadow"
          >
            {action.icon}
            <span className="font-medium">{action.label}</span>
          </button>
        ))}
      </section>

      <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Confirmed Appointments */}
        <section className="bg-zinc-50 dark:bg-zinc-800 rounded-lg shadow p-6 md:col-span-1">
          <header className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">Confirmed Appointments</h2>
            <FaCalendarCheck className="text-xl text-blue-500" />
          </header>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {confirmedAppointments.map((appt:any) => {
              const status = statusMap[appt.status] || {
                label: appt.status,
                color: "text-gray-500",
                icon: <FaInfoCircle />,
              };
              const consultationIcon = appt.consultation_type === "virtual" ? "🎧" : "🏥";
              return (
                <li
                  key={appt.id}
                  className="flex flex-col justify-between gap-2 bg-white dark:bg-zinc-900 p-4 rounded border dark:border-zinc-700 shadow-sm hover:shadow-md transition"
                >
                  <div className="space-y-1">
                    <p className="font-semibold text-base truncate">{appt.doctor?.name}</p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">{appt.doctor?.specialty}</p>
                    {appt.purpose && (
                      <p className="text-xs text-muted-foreground italic">Purpose: {appt.purpose}</p>
                    )}
                  </div>
                  <div className="text-sm space-y-1">
                    <p className="font-semibold">{new Date(appt.timeSlot.date).toLocaleDateString()}</p>
                    <p>{appt.time}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <span>{consultationIcon}</span>
                      <span>{appt.consultation_type}</span>
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-medium ${status.color}`}>
                      {status.icon}
                      <span>{status.label}</span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Lab Results Summary */}
        <section className="bg-zinc-50 dark:bg-zinc-800 rounded-lg shadow p-6 md:col-span-1">
          <header className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">Lab Results Summary</h2>
            <FaFlask className="text-xl text-blue-500" />
          </header>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {labResults.map((result:any) => (
              <div
                key={result.id}
                className="flex flex-col space-y-2 bg-white dark:bg-zinc-900 p-4 rounded border dark:border-zinc-700 shadow-sm"
              >
                <p className="font-semibold text-base">{result.parameterName}</p>
                <p className="text-sm">
                  <span className="font-medium">Result:</span> {result.resultValue} {result.unit}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Reference Range:</span> {result.referenceRange}
                </p>
                <p className={`text-sm font-medium ${result.abnormalFlag === "normal" ? "text-green-600" : "text-red-600"}`}>
                  <span className="font-medium">Abnormal Flag:</span> {result.abnormalFlag}
                </p>
                {result.notes && (
                  <p className="text-xs text-muted-foreground italic">Notes: {result.notes}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Current Medications */}
        <section className="space-y-6 md:col-span-1">
          <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg shadow p-6">
            <header className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg">Current Medications</h2>
              <FaPills className="text-xl text-blue-500" />
            </header>
            <ul className="space-y-4">
              {medications.map((med:any) => (
                <li
                  key={med.id}
                  className="flex items-center justify-between border rounded p-3 dark:border-zinc-700"
                >
                  <div className="flex items-center space-x-3">
                    <FaPills className="text-xl text-indigo-600" />
                    <div>
                      <p className="font-semibold">{med.name}</p>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">{med.dosage}</p>
                    </div>
                  </div>
                  <div className="text-sm text-right">
                    {med.status === "normal" && (
                      <span className="text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300 px-2 py-0.5 rounded">
                        {med.daysLeft} days left
                      </span>
                    )}
                    {med.status === "refillNeeded" && (
                      <span className="text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300 px-2 py-0.5 rounded">
                        Refill needed
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* AI Assistant */}
          <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg shadow p-6 text-center">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-700 text-indigo-700 dark:text-white mx-auto text-3xl mb-3">
              <FaRobot />
            </div>
            <p className="text-sm mb-4">
              Your AI assistant is ready to help with medications, appointments, and health questions.
            </p>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow transition">
              Start Chat
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default UserDashboardHome;