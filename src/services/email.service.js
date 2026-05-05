import nodemailer from 'nodemailer';
import { config } from '../config/config.js';
import logger from '../utils/logger.js';

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
    });
  }

  async sendEmail(to, subject, text, html) {
    try {
      const info = await this.transporter.sendMail({
        from: config.email.from,
        to,
        subject,
        text,
        html,
      });
      logger.info(`Email sent: ${info.messageId}`);
      return info;
    } catch (err) {
      logger.error(`Error sending email: ${err.message}`);
    }
  }

  async sendBookingConfirmation(user, booking) {
    const subject = 'Booking Confirmation';
    const text = `Hi ${user.name},\n\nYour booking for ${booking.resource.name} from ${booking.startDate} to ${booking.endDate} has been created and is pending payment.\n\nTotal: $${booking.totalPrice}`;
    const html = `<h1>Booking Confirmation</h1><p>Hi ${user.name},</p><p>Your booking for <strong>${booking.resource.name}</strong> has been created.</p><p>Status: PENDING PAYMENT</p><p>Total: $${booking.totalPrice}</p>`;
    
    await this.sendEmail(user.email, subject, text, html);
  }

  async sendPaymentSuccess(user, booking) {
    const subject = 'Payment Successful';
    const text = `Hi ${user.name},\n\nYour payment for booking ${booking.id} was successful. Your reservation is now confirmed.`;
    const html = `<h1>Payment Successful</h1><p>Hi ${user.name},</p><p>Your payment for booking <strong>${booking.id}</strong> was successful.</p><p>Your reservation is now <strong>CONFIRMED</strong>.</p>`;
    
    await this.sendEmail(user.email, subject, text, html);
  }

  async sendCancellation(user, booking) {
    const subject = 'Booking Cancelled';
    const text = `Hi ${user.name},\n\nYour booking for ${booking.resource.name} has been cancelled.`;
    const html = `<h1>Booking Cancelled</h1><p>Hi ${user.name},</p><p>Your booking for <strong>${booking.resource.name}</strong> has been cancelled.</p>`;
    
    await this.sendEmail(user.email, subject, text, html);
  }
}

export default new EmailService();
