import nodemailer from "nodemailer";
import { env } from "../config/env";

const transporter = nodemailer.createTransport({
  host: env.smtpHost,
  port: env.smtpPort,
  secure: false,
  auth: {
    user: env.smtpUser,
    pass: env.smtpPass
  }
});

export const sendBookingEmail = async (to: string, subject: string, html: string): Promise<void> => {
  if (!env.smtpHost || !env.smtpUser || !env.smtpPass) {
    // In local development without SMTP this safely skips sending.
    return;
  }

  await transporter.sendMail({
    from: env.emailFrom,
    to,
    subject,
    html
  });
};
