const PDFDocument = require('pdfkit');
import { User } from '../../user/entities/user.entity';
import { MedicationRequest } from '../../medication_requests/entities/medication_request.entity';
import { Injectable } from '@nestjs/common';
import { Buffer } from 'buffer';

@Injectable()
export class InvoiceService {
  async generateMedicationInvoice(
    user: User,
    requests: MedicationRequest[],
    totalAmount: number,
    invoiceNumber: string
  ): Promise<Buffer> {
    const doc = new PDFDocument({ margin: 50 });
    const chunks: Buffer[] = [];

    return new Promise((resolve, reject) => {
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Branding Header
      doc
        .fontSize(22)
        .fillColor('#0f172a')
        .font('Helvetica-Bold')
        .text('🏥 Housepital360', { align: 'center' })
        .fontSize(12)
        .font('Helvetica')
        .fillColor('#4b5563')
        .text('Smart Patient-Centered Care', { align: 'center' })
        .moveDown();

      // Invoice Title
      doc
        .fontSize(18)
        .font('Helvetica-Bold')
        .fillColor('#1e3a8a')
        .text('Medication Order Invoice', { align: 'center' })
        .moveDown(1);

      // Invoice & Patient Info
      doc
        .fontSize(11)
        .fillColor('#000')
        .font('Helvetica')
        .text(`Invoice Number: ${invoiceNumber}`)
        .text(`Issued Date: ${new Date().toLocaleDateString()}`)
        .moveDown()
        .text(`Patient Name: ${user.name}`)
        .text(`Email: ${user.email}`)
        .moveDown();

      // Medication Table Header
      doc
        .font('Helvetica-Bold')
        .fontSize(12)
        .fillColor('#1f2937')
        .text('No.', 50, doc.y, { continued: true })
        .text('Medication', 90, doc.y, { continued: true })
        .text('Dosage', 230, doc.y, { continued: true })
        .text('Qty', 300, doc.y, { continued: true })
        .text('Duration', 340, doc.y, { continued: true })
        .text('Price', 420, doc.y)
        .moveDown(0.5);

      // Medication List
      requests.forEach((r, idx) => {
        const price = typeof r.inventory?.price === 'string'
          ? parseFloat(r.inventory.price)
          : r.inventory?.price ?? 0;

        doc
          .font('Helvetica')
          .fontSize(11)
          .fillColor('#111827')
          .text(`${idx + 1}`, 50, doc.y, { continued: true })
          .text(`${r.medication.name}`, 90, doc.y, { continued: true })
          .text(`${r.dosage || '-'}`, 230, doc.y, { continued: true })
          .text(`${r.quantity}`, 300, doc.y, { continued: true })
          .text(`${r.duration || '-'}`, 340, doc.y, { continued: true })
          .text(`$${(price * r.quantity).toFixed(2)}`, 420, doc.y)
          .moveDown(0.5);
      });

      // Divider
      doc
        .moveDown()
        .strokeColor('#d1d5db')
        .lineWidth(1)
        .moveTo(50, doc.y)
        .lineTo(550, doc.y)
        .stroke();

      // Total Amount
      doc
        .moveDown(1)
        .font('Helvetica-Bold')
        .fontSize(13)
        .fillColor('#000')
        .text(`Total Amount Due: $${totalAmount.toFixed(2)}`, { align: 'right' });

      // Signature
      doc
        .moveDown(3)
        .fontSize(11)
        .fillColor('#000')
        .font('Helvetica')
        .text('Signed electronically by:', { align: 'left' })
        .moveDown(0.5)
        .font('Helvetica-Bold')
        .text('Housepital360 Pharmacy Department')
        .font('Helvetica')
        .text('Authorized Signature', { italic: true });

      // Footer Note
      doc
        .moveDown(4)
        .fontSize(9)
        .fillColor('gray')
        .text('This is a computer-generated invoice and does not require a physical signature.', {
          align: 'center',
        });

      doc.end();
    });
  }
}
