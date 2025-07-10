'use client';

import { useTheme } from '@/utils/themeProvider';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { FaPrescriptionBottle, FaCheckCircle, FaBoxOpen, FaClock } from 'react-icons/fa';
import { Eye, Pencil, Trash2, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

const stats = [
  { label: 'Total Prescriptions', count: 124, icon: <FaPrescriptionBottle />, color: 'text-primary' },
  { label: 'Active', count: 67, icon: <FaCheckCircle />, color: 'text-green-600' },
  { label: 'Fulfilled', count: 45, icon: <FaBoxOpen />, color: 'text-sky-500' },
  { label: 'Pending', count: 12, icon: <FaClock />, color: 'text-yellow-500' },
];

const prescriptions = [
  {
    patientName: 'Sarah Johnson',
    id: 'PAT-001',
    appointment: 'Today, 2:30 PM',
    type: 'Consultation',
    status: 'Active',
    valid: 'Jan 15 → Jan 22',
    avatar: '/avatars/female1.png',
  },
  {
    patientName: 'Michael Chen',
    id: 'PAT-002',
    appointment: 'Tomorrow, 10:00 AM',
    type: 'Follow-up',
    status: 'Draft',
    valid: 'Jan 16 → Jan 23',
    avatar: '/avatars/male1.png',
  },
];

export default function DoctorPrescriptionsDashboard() {
  const { theme } = useTheme();

  const statusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Draft':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, idx) => (
          <Card key={idx} className="p-4 flex flex-col items-center justify-center text-center">
            <div className={cn('text-2xl mb-2', s.color)}>{s.icon}</div>
            <p className="text-2xl font-bold">{s.count}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Prescriptions Table */}
      <Card className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Prescriptions</h2>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-1" /> Create Prescription
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <Input placeholder="Search patient name..." className="md:flex-1" />
          <select className="border rounded px-3 py-2 text-sm bg-background text-foreground">
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Draft">Draft</option>
          </select>
        </div>

        <div className="space-y-4">
          {prescriptions.map((p, i) => (
            <div
              key={i}
              className={cn(
                'flex items-center justify-between border rounded-lg p-4',
                theme === 'dark' ? 'bg-zinc-900' : 'bg-white'
              )}
            >
              <div className="flex items-center gap-4">
                <img src={p.avatar} alt={p.patientName} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="font-semibold">{p.patientName}</p>
                  <p className="text-sm text-muted-foreground">{p.id}</p>
                </div>
              </div>
              <div className="hidden md:block text-sm text-muted-foreground text-center">
                <p>{p.appointment}</p>
                <p className="text-xs">{p.type}</p>
              </div>
              <div>
                <Badge className={statusColor(p.status)}>{p.status}</Badge>
              </div>
              <div className="hidden md:block text-sm text-muted-foreground">
                {p.valid}
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon"><Eye className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon"><Pencil className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className="text-red-600"><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
