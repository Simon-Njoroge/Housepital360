import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: false,
      auth: {
        user: this.configService.get<string>('SMTP_USERNAME'),
        pass: this.configService.get<string>('SMTP_PASSWORD'),
      },
    });

    this.transporter.verify((error, success) => {
      if (error) {
        console.error('Email transport verification failed:', error);
      } else {
        console.log('Email service is ready.');
      }
    });
  }

  async sendEmail(
    to: string,
    subject: string,
    htmlContent: string,
  ): Promise<void> {
    const fromName = this.configService.get<string>('EMAIL_FROM');
    const fromAddress = this.configService.get<string>('SMTP_FROM_NAME');

    await this.transporter.sendMail({
      from: `"${fromName}" <${fromAddress}>`,
      to,
      subject,
      html: htmlContent,
    });

    console.log(`Email sent to ${to} with subject "${subject}"`);
  }

  private compileTemplate(templateName: string, context: any): string {
  const filePath = path.join(process.cwd(), 'dist/templates', `${templateName}.hbs`);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Template file not found: ${filePath}`);
    }
    const source = fs.readFileSync(filePath, 'utf8');
    const template = handlebars.compile(source);
    return template(context);
  }

  async sendEmailAppointment({
    to,
    subject,
    html,
  }: {
    to: string;
    subject: string;
    html: string;
  }): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: '"Housepital360" <your-email@gmail.com>', // Replace with your email
        to,
        subject,
        html,
      });
      console.log(`Email sent to ${to}`);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }

  async sendWelcomeWithPassword(
  email: string,
  name: string,
  password: string,
): Promise<void> {
  const appUrl = this.configService.get<string>('APP_URL');

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background: #f9f9f9; padding: 20px; border-radius: 8px; color: #333;">
      <h2 style="color: #4CAF50;">Welcome, ${name}!</h2>
      <p>We're excited to have you at <strong>Housepital360 🏥</strong>.</p>

      <p>Your account has been created successfully. Please find your login credentials below:</p>

      <ul>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Password:</strong> ${password}</li>
      </ul>

      <p>
        You can log in here: 
        <a href="${appUrl}/login" style="color: #4CAF50;">${appUrl}/login</a>
      </p>

      <p style="font-size: 14px; color: #777;">
        <em>Please remember to change your password after your first login for security purposes.</em>
      </p>

      <hr style="margin-top: 30px;" />
      <p style="font-size: 12px; color: #aaa;">
        If you did not request this, you can safely ignore this email.
      </p>
    </div>
  `;

  await this.sendEmail(
    email,
    'Welcome to Housepital360 – Your Login Details',
    html,
  );
}
async sendWithAttachment(options: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  attachments: {
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }[];
}): Promise<void> {
  const fromName = this.configService.get<string>('EMAIL_FROM');
  const fromAddress = this.configService.get<string>('SMTP_FROM_NAME');

  await this.transporter.sendMail({
    from: `"${fromName}" <${fromAddress}>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
    attachments: options.attachments,
  });

  console.log(`📧 Email with attachment sent to ${options.to}`);
}

async sendAppointmentEmailWithAttachment({
  to,
  subject,
  html,
  attachments,
}: {
  to: string;
  subject: string;
  html: string;
  attachments: { filename: string; content: Buffer }[];
}) {
  await this.transporter.sendMail({
    from: '"Housepital360" <no-reply@housepital360.com>',
    to,
    subject,
    html,
    attachments,
  });
}



}
