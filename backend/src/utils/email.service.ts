import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { injectable } from "inversify";
import { IEmailService } from "@/interface/emai.service.interface";

dotenv.config();

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

@injectable()
export class EmailService implements IEmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  private async sendMail(options: EmailOptions) {
    await this.transporter.sendMail({
      from: `"LearnCircle" <${process.env.SMTP_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
  }

  private buildTemplate(
    title: string,
    message: string,
    otp: string,
    note: string,
  ) {
    return `
      <div style="max-width:600px;margin:0 auto;padding:20px;font-family:'Segoe UI',Roboto,Arial,sans-serif;color:#111;line-height:1.6;">
        <h2 style="margin-bottom:16px;font-size:20px;font-weight:600;">${title}</h2>
        <p style="margin:0 0 16px 0;">${message}</p>
        <p style="margin:24px 0;font-size:28px;font-weight:bold;letter-spacing:2px;text-align:center;color:#000;">
          ${otp}
        </p>
        <p style="margin:0 0 16px 0;">${note}</p>
        <hr style="margin:32px 0;border:none;border-top:1px solid #ddd;">
        <p style="font-size:12px;color:#666;text-align:center;">© ${new Date().getFullYear()} LearnCircle. All rights reserved.</p>
      </div>
    `;
  }

  async sendSignupOtp(to: string, otp: string) {
    const html = this.buildTemplate(
      "Complete Your Signup",
      "Thank you for signing up. Your One-Time Password (OTP) to complete the signup process is:",
      otp,
      "Please enter this code within the next 1 minute. If you did not sign up, you can safely ignore this email.",
    );
    await this.sendMail({ to, subject: "Your LearnCircle Signup OTP", html });
  }
}
