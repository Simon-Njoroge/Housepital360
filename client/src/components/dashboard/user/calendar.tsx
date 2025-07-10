'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { toast } from 'sonner';
import { FaCalendarAlt } from 'react-icons/fa';
import { useAppointmentsStoreActions } from '@/store/appointmentstore';
import { useStore } from '@tanstack/react-store';
import { authStore } from '@/store/authstore';
import { useEffect, useState } from 'react';

const StandaloneCalendar: React.FC = () => {
  const { userId } = useStore(authStore);
  const { appointments: resp } = useAppointmentsStoreActions(userId ?? undefined);
  const [appointments, setAppointments] = useState<Array<any>>([]);

  useEffect(() => {
    if ((resp as any)?.data) {
      setAppointments((resp as any).data);
    }
  }, [resp]);

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
        <FaCalendarAlt /> Calendar Overview
      </h3>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          start: 'prev,next today',
          center: 'title',
          end: 'dayGridMonth,timeGridWeek,listWeek',
        }}
        events={appointments
          .filter((a) => a.status === 'pending' || a.status === 'confirmed')
          .map((a) => ({
            title: `${a.doctor?.name} (${a.consultation_type})`,
            start: `${a.timeSlot?.date}T${a.timeSlot?.start_time}`,
            end: `${a.timeSlot?.date}T${a.timeSlot?.end_time}`,
            extendedProps: { appointmentId: a.id },
          }))}
        height="auto"
        selectable
        dateClick={(info) => toast(`Selected date: ${info.dateStr}`)}
        eventClick={(info) => {
          const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Appointment&dates=${info.event.startStr.replace(
            /[-:]/g,
            '',
          )}/${info.event.endStr.replace(/[-:]/g, '')}`;
          window.open(url, '_blank');
        }}
      />
    </div>
  );
};

export default StandaloneCalendar;