import { Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Appointment } from './entities/appointment.entity';
import { User } from 'src/user/entities/user.entity';
import { Department } from 'src/departments/entities/department.entity';
import { TimeSlot } from 'src/time-slots/entities/time-slot.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DoctorProfile } from 'src/doctor-profiles/entities/doctor-profile.entity';
import { EmailService } from 'src/common/utils/email/email.service';
import { InvoiceAppointmentService } from 'src/common/utils/generateappointmentinvoice';
import { Invoice } from 'src/invoices/entities/invoice.entity';
import {
  PatientQueue,
  QueueStatus,
} from 'src/patient-queue/entities/patient-queue.entity';
import { AppointmentStatus } from './entities/appointment.entity';
import { Cron } from '@nestjs/schedule';
import { Raw } from 'typeorm';
@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(PatientQueue)
    private readonly patientQueueRepository: Repository<PatientQueue>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
    @InjectRepository(TimeSlot)
    private readonly timeSlotRepository: Repository<TimeSlot>,
    @InjectRepository(DoctorProfile)
    private readonly doctorProfileRepo: Repository<DoctorProfile>,
    @InjectRepository(Invoice)
    private readonly invoiceRepo: Repository<Invoice>,
    private readonly invoiceService: InvoiceAppointmentService,
    private readonly emailService: EmailService,
  ) {}

  async create(
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<{ appointment?: Appointment; error?: string }> {
    try {
      const patient = await this.userRepository.findOne({
        where: { id: createAppointmentDto.patient_id },
      });
      if (!patient) {
        console.error('Patient not found:', createAppointmentDto.patient_id);
        return { error: 'Patient not found' };
      }

      const doctor = await this.userRepository.findOne({
        where: { id: createAppointmentDto.doctor_id },
      });
      if (!doctor) {
        console.error('Doctor not found:', createAppointmentDto.doctor_id);
        return { error: 'Doctor not found' };
      }

      const department = await this.departmentRepository.findOne({
        where: { id: createAppointmentDto.department_id },
      });
      if (!department) {
        console.error(
          'Department not found:',
          createAppointmentDto.department_id,
        );
        return { error: 'Department not found' };
      }

      const timeSlot = await this.timeSlotRepository.findOne({
        where: { id: createAppointmentDto.time_slot_id },
      });
      if (!timeSlot) {
        console.error(
          'Time slot not found:',
          createAppointmentDto.time_slot_id,
        );
        return { error: 'Time slot not found' };
      }

      const doctorProfile = await this.doctorProfileRepo.findOne({
        where: { user: { id: doctor.id } },
      });

      const consultation_fee = Number(doctorProfile?.consultation_fee ?? 0);

      timeSlot.is_booked = true;
      await this.timeSlotRepository.save(timeSlot);

      const appointment = this.appointmentRepository.create({
        ...createAppointmentDto,
        patient_id: patient.id,
        doctor_id: doctor.id,
        department_id: department.id,
        time_slot_id: timeSlot.id,
      });

      const savedAppointment =
        await this.appointmentRepository.save(appointment);

      const patientQueue = this.patientQueueRepository.create({
        appointment: savedAppointment,
        status: QueueStatus.WAITING,
        current_position: undefined,
      });
      await this.patientQueueRepository.save(patientQueue);

      const invoiceNumber = `APT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const invoice = this.invoiceRepo.create({
        patient_id: patient.id,
        invoice_number: invoiceNumber,
        subtotal: consultation_fee,
        grand_total: consultation_fee,
        balance_due: consultation_fee,
        issue_date: new Date(),
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        notes: `Auto-generated for medication(s)`,
      });
      await this.invoiceRepo.save(invoice);

      const invoiceBuffer =
        await this.invoiceService.generateAppointmentInvoice(
          patient,
          doctor,
          department,
          timeSlot,
          consultation_fee,
          invoiceNumber,
        );

      // await this.emailService.sendAppointmentEmailWithAttachment({
      //   to: patient.email,
      //   subject: `Appointment Invoice - ${invoiceNumber}`,
      //   html: `<p>Dear ${patient.name},</p><p>Your appointment with Dr. ${doctor.name} has been confirmed. Attached is your invoice.</p>`,
      //   attachments: [
      //     {
      //       filename: `invoice-${invoiceNumber}.pdf`,
      //       content: invoiceBuffer,
      //     },
      //   ],
      // });

      return { appointment: savedAppointment };
    } catch (error) {
      console.error('Error creating appointment:', error);
      return { error: 'Failed to create appointment' };
    }
  }
  async findAll(): Promise<{ appointments?: Appointment[]; error?: string }> {
    try {
      const appointments = await this.appointmentRepository.find({
        relations: ['patient', 'doctor', 'department', 'timeSlot'],
      });
      return { appointments };
    } catch (error) {
      return { error: 'Failed to fetch appointments' };
    }
  }

  //find all by user id
  async findAllByUserId(
    userId: string,
  ): Promise<{ appointments?: Appointment[]; error?: string }> {
    try {
      const appointments = await this.appointmentRepository.find({
        where: { patient: { id: userId } },
        relations: ['patient', 'doctor', 'department', 'timeSlot'],
        order: { created_at: 'DESC' },
      });

      return { appointments };
    } catch (error) {
      console.error('Error fetching appointments by user ID:', error);
      return { error: 'Failed to fetch user appointments' };
    }
  }

  async findOne(
    id: string,
  ): Promise<{ appointment?: Appointment; error?: string }> {
    try {
      const appointment = await this.appointmentRepository.findOne({
        where: { id },
        relations: ['patient', 'doctor', 'department', 'timeSlot'],
      });

      if (!appointment) {
        return { error: 'Appointment not found' };
      }

      return { appointment };
    } catch (error) {
      return { error: 'Failed to fetch appointment' };
    }
  }

  //get all appintments by doctor Id

  async findAllPatientsByDoctorId(doctorId: string): Promise<{
    patients?: {
      patient: User;
      profile?: any;
      timeSlot: TimeSlot;
      appointment: Appointment;
    }[];
    error?: string;
  }> {
    try {
      const appointments = await this.appointmentRepository.find({
        where: { doctor_id: doctorId },
        relations: ['patient', 'timeSlot', 'patient.patientProfile'],
      });

      const patientsWithDetails = appointments.map((appointment) => ({
        patient: appointment.patient,
        profile: appointment.patient.patientProfile,
        timeSlot: appointment.timeSlot,
        appointment,
      }));

      return { patients: patientsWithDetails };
    } catch (error) {
      console.error('Error fetching patients by doctor ID:', error);
      return { error: 'Failed to fetch patients related to the doctor' };
    }
  }
  async update(
    id: string,
    updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<{ appointment?: Appointment; error?: string }> {
    const existingAppointment = await this.findOne(id);

    if (!existingAppointment.appointment) {
      return { error: existingAppointment.error };
    }

    try {
      await this.appointmentRepository.update(id, updateAppointmentDto);

      // Refetch the updated appointment
      const updated = await this.appointmentRepository.findOne({
        where: { id },
        relations: ['doctor', 'patient', 'timeSlot', 'department'], // add/remove as necessary
      });

      if (!updated) {
        return { error: 'Appointment not found after update' };
      }

      return { appointment: updated };
    } catch (error) {
      return { error: 'Failed to update appointment' };
    }
  }
  async confirmAppointment(
    appointmentId: string,
  ): Promise<{ success?: boolean; error?: string }> {
    try {
      if (!appointmentId) {
        return { error: 'Invalid appointment ID' };
      }

      const appointment = await this.appointmentRepository.findOne({
        where: { id: appointmentId },
        relations: ['patient', 'doctor', 'timeSlot', 'department'],
      });

      if (!appointment) {
        return { error: 'Appointment not found' };
      }

     

      appointment.status = AppointmentStatus.CONFIRMED;
      await this.appointmentRepository.save(appointment);

      // Send confirmation email to the patient
      const emailContent = `
      <p>Dear ${appointment.patient.name},</p>
      <p>Your appointment with Dr. ${appointment.doctor.name} has been confirmed.</p>
      <p><strong>Date:</strong> ${appointment.timeSlot.date}</p>
      <p><strong>Time:</strong> ${appointment.timeSlot.start_time} - ${appointment.timeSlot.end_time}</p>
      <p><strong>Department:</strong> ${appointment.department.name}</p>
      <p>Thank you for choosing our services.</p>
    `;

      await this.emailService.sendEmailAppointment({
        to: appointment.patient.email,
        subject: 'Appointment Confirmation',
        html: emailContent,
      });

      return { success: true };
    } catch (error) {
      console.error('Error confirming appointment:', error);
      return { error: 'Failed to confirm appointment' };
    }
  }

  async completeAppointment(
  appointmentId: string,
): Promise<{ success?: boolean; error?: string }> {
  try {
    if (!appointmentId) {
      return { error: 'Invalid appointment ID' };
    }

    const appointment = await this.appointmentRepository.findOne({
      where: { id: appointmentId },
      relations: ['patient', 'doctor', 'timeSlot', 'department'],
    });

    if (!appointment) {
      return { error: 'Appointment not found' };
    }

    if (appointment.status !== AppointmentStatus.CONFIRMED) {
      return { error: 'Only confirmed appointments can be marked as completed' };
    }

    appointment.status = AppointmentStatus.COMPLETED;
    await this.appointmentRepository.save(appointment);

    // Send completion email to the patient
    const emailContent = `
      <p>Dear ${appointment.patient.name},</p>
      <p>Your appointment with Dr. ${appointment.doctor.name} has been successfully completed.</p>
      <p><strong>Date:</strong> ${appointment.timeSlot.date}</p>
      <p><strong>Time:</strong> ${appointment.timeSlot.start_time} - ${appointment.timeSlot.end_time}</p>
      <p><strong>Department:</strong> ${appointment.department.name}</p>
      <p>Thank you for choosing our services. We hope to see you again!</p>
    `;

    await this.emailService.sendEmailAppointment({
      to: appointment.patient.email,
      subject: 'Appointment Completion',
      html: emailContent,
    });

    return { success: true };
  } catch (error) {
    console.error('Error completing appointment:', error);
    return { error: 'Failed to complete appointment' };
  }
}

  async remove(id: string): Promise<{ success?: boolean; error?: string }> {
    const existingAppointment = await this.findOne(id);

    if (!existingAppointment.appointment) {
      return { error: existingAppointment.error };
    }

    try {
      await this.appointmentRepository.remove(existingAppointment.appointment);
      return { success: true };
    } catch (error) {
      return { error: 'Failed to delete appointment' };
    }
  }
  @Cron('0 */5 * * * *') 
  async markNoShowAppointments(): Promise<void> {
    try {
      const now = new Date();

      // Fetch appointments with status PENDING and where the timeSlot.end_time has passed
      const appointments = await this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.timeSlot', 'timeSlot')
      .leftJoinAndSelect('appointment.patient', 'patient')
      .where('appointment.status = :status', { status: AppointmentStatus.PENDING })
      .andWhere(
        `TO_CHAR(timeSlot.end_time, 'HH24:MI:SS') < TO_CHAR(NOW(), 'HH24:MI:SS')`
      )
      .getMany();


      for (const appointment of appointments) {

        appointment.status = AppointmentStatus.NO_SHOW;
        await this.appointmentRepository.save(appointment);

        const emailContent = `
          <p>Dear ${appointment.patient.name},</p>
          <p>We noticed that you missed your scheduled appointment.</p>
          <p><strong>Date:</strong> ${appointment.timeSlot.date}</p>
          <p><strong>Time:</strong> ${appointment.timeSlot.start_time} - ${appointment.timeSlot.end_time}</p>
          <p>Please contact us if you would like to reschedule.</p>
          <p>Thank you for choosing our services.</p>
        `;

        await this.emailService.sendEmailAppointment({
          to: appointment.patient.email,
          subject: 'Missed Appointment Notification',
          html: emailContent,
        });

        console.log(
          `Appointment ${appointment.id} marked as NO_SHOW and email sent to ${appointment.patient.email}`,
        );
      }
    } catch (error) {
      console.error('Error marking appointments as NO_SHOW:', error);
    }
  }
}
