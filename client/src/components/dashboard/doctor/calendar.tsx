'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { toast } from 'sonner';
import { FaCalendarAlt } from 'react-icons/fa';
import { useStore } from '@tanstack/react-store';
import { authStore } from '@/store/authstore';
import { useEffect, useState } from 'react';
import { useAppointmentsByDoctorId } from '@/hooks/userappointment';
import { string } from 'zod';

const StandaloneDocCalendar: React.FC = () => {
  const { userId } = useStore(authStore);
  const { data: appointmentsData } = useAppointmentsByDoctorId(userId as string);
  const [appointments, setAppointments] = useState<Array<any>>([]);

  useEffect(() => {
    if ((appointmentsData as any)?.patients) {
      const mappedAppointments = (appointmentsData as any).patients.map((appointment:any) => ({
        title: `${appointment.patient?.name} (${appointment.appointment.consultation_type})`,
        start: `${appointment.timeSlot?.date}T${appointment.timeSlot?.start_time}`,
        end: `${appointment.timeSlot?.date}T${appointment.timeSlot?.end_time}`,
        extendedProps: { appointmentId: appointment.appointment?.id },
      }));
      setAppointments(mappedAppointments);
    }
  }, [appointmentsData]);

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
        events={appointments}
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

export default StandaloneDocCalendar;