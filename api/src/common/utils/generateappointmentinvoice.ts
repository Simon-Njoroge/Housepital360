const PDFDocument = require('pdfkit');
import { Injectable } from '@nestjs/common';
import { User } from '../../user/entities/user.entity';
import { Department } from '../../departments/entities/department.entity';
import { TimeSlot } from '../../time-slots/entities/time-slot.entity';
import { Buffer } from 'buffer';
@Injectable()
export class InvoiceAppointmentService {
async generateAppointmentInvoice(
  patient: User,
  doctor: User,
  department: Department,
  timeSlot: TimeSlot,
  fee: number,
  invoiceNumber: string
): Promise<Buffer> {
  const doc = new PDFDocument({ margin: 50 });
  const chunks: Buffer[] = [];

  return new Promise((resolve, reject) => {
    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // Header
    doc
      .fontSize(20)
      .fillColor('#0f172a')
      .font('Helvetica-Bold')
      .text('🏥 Housepital360', { align: 'center' })
      .fontSize(12)
      .text('Smart Patient-Centered Care', { align: 'center' })
      .moveDown();

    // Invoice title
    doc
      .fontSize(16)
      .fillColor('#1e3a8a')
      .text('Appointment Invoice', { align: 'center' })
      .moveDown();

    // Invoice info
    doc
      .fillColor('#000')
      .fontSize(11)
      .text(`Invoice Number: ${invoiceNumber}`)
      .text(`Date: ${new Date().toLocaleDateString()}`)
      .moveDown();

    // Patient and Appointment info
    doc
      .text(`Patient: ${patient.name}`)
      .text(`Doctor: Dr. ${doctor.name}`)
      .text(`Specialization: ${department.name}`)
      .text(`Time: ${timeSlot.start_time} - ${timeSlot.end_time}`)
      .moveDown();

    // Fee Summary
    doc
      .fontSize(13)
      .font('Helvetica-Bold')
      .text(`Consultation Fee: $${fee.toFixed(2)}`, { align: 'right' });

    doc.end();
  });
}
}