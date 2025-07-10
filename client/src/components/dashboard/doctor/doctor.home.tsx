'use client';

import {
  FaClock,
  FaFlask,
  FaStar,
  FaNotesMedical,
} from 'react-icons/fa';

export default function DoctorDashboard() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">


      <main className="p-6 space-y-6">
        <h2 className="text-2xl font-bold">Good Morning, Dr. Johnson</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          You have 8 appointments today
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Patients Today" value="24" />
          <StatCard title="Avg Wait Time" value="12m" icon={<FaClock />} />
          <StatCard title="Pending Labs" value="7" icon={<FaFlask />} />
          <StatCard title="Satisfaction" value="4.8" icon={<FaStar />} />
        </div>

        {/* Appointments + Calendar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-semibold">Today's Appointments</h3>
            <div className="space-y-2">
              {[
                {
                  name: 'Emma Thompson',
                  time: '9:00 AM',
                  note: 'Routine Checkup',
                  status: 'Confirmed',
                  statusColor: 'green',
                },
                {
                  name: 'Michael Chen',
                  time: '10:30 AM',
                  note: 'Follow-up Visit',
                  status: 'Current',
                  statusColor: 'blue',
                },
                {
                  name: 'Lisa Rodriguez',
                  time: '11:15 AM',
                  note: 'Consultation',
                  status: 'Waiting',
                  statusColor: 'yellow',
                },
              ].map((appt, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center p-3 rounded-md border dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                >
                  <div>
                    <p className="font-semibold">{appt.name}</p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">{appt.note}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{appt.time}</p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full bg-${appt.statusColor}-100 text-${appt.statusColor}-700 dark:bg-${appt.statusColor}-900 dark:text-${appt.statusColor}-300`}
                    >
                      {appt.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Calendar */}
          <div className="rounded-md border p-4 dark:border-zinc-700">
            <h3 className="text-lg font-semibold mb-4">Calendar</h3>
            <div className="text-center text-sm">
              <p className="font-medium">December 2024</p>
              <div className="grid grid-cols-7 gap-1 text-xs mt-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d) => (
                  <div key={d} className="font-bold text-zinc-500 dark:text-zinc-400">{d}</div>
                ))}
                {Array.from({ length: 31 }, (_, i) => {
                  const day = i + 1;
                  const isToday = day === 15;
                  return (
                    <div
                      key={day}
                      className={`p-1 rounded-full ${
                        isToday
                          ? 'bg-blue-600 text-white'
                          : 'text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Prescription & Messages */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-md border p-4 dark:border-zinc-700">
            <h3 className="text-lg font-semibold mb-3">Quick Prescription</h3>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2">
              <FaNotesMedical /> Write New Prescription
            </button>
            <ul className="mt-3 text-sm list-disc ml-5 text-zinc-500 dark:text-zinc-400">
              <li>Hypertension Standard</li>
              <li>Diabetes Follow-up</li>
            </ul>
          </div>

          <div className="rounded-md border p-4 dark:border-zinc-700">
            <h3 className="text-lg font-semibold mb-3">Recent Messages</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">John Davis</p>
                  <p className="text-zinc-500 dark:text-zinc-400">
                    Question about medication timing
                  </p>
                </div>
                <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full dark:bg-red-900 dark:text-red-300">
                  New
                </span>
              </div>
              <div>
                <p className="font-medium">Anna Wilson</p>
                <p className="text-zinc-500 dark:text-zinc-400">
                  Thanks for the prescription update
                </p>
              </div>
              <a
                href="#"
                className="block text-sm text-blue-600 mt-2 dark:text-blue-400"
              >
                View All Messages
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="p-4 rounded-md border shadow-sm bg-white dark:bg-zinc-800 dark:border-zinc-700">
      <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
        {icon && <span className="text-xl text-blue-600 dark:text-blue-400">{icon}</span>}
        {title}
      </div>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}
