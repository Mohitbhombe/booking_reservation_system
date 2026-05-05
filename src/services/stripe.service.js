import Stripe from 'stripe';
import { config } from '../config/config.js';
import prisma from '../prisma/client.js';
import { AppError } from '../middleware/errorHandler.js';
import logger from '../utils/logger.js';

const stripe = new Stripe(config.stripe.secretKey);

class StripeService {
  async createCheckoutSession(bookingId, userId) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { resource: true },
    });

    if (!booking) {
      throw new AppError('Booking not found', 404);
    }

    if (booking.userId !== userId) {
      throw new AppError('Not authorized', 403);
    }

    if (booking.status !== 'PENDING') {
      throw new AppError(`Booking status is ${booking.status}, cannot pay.`, 400);
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: booking.resource.name,
              description: booking.resource.description || '',
            },
            unit_amount: Math.round(parseFloat(booking.totalPrice) * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${config.frontendUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${config.frontendUrl}/payment-cancel`,
      metadata: {
        bookingId: booking.id,
        userId: booking.userId,
      },
    });

    // Create payment record in PENDING status
    await prisma.payment.upsert({
      where: { bookingId: booking.id },
      update: { stripeSessionId: session.id },
      create: {
        bookingId: booking.id,
        amount: booking.totalPrice,
        stripeSessionId: session.id,
        status: 'PENDING',
      },
    });

    return session;
  }

  async handleWebhook(signature, payload) {
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        payload,
        signature,
        config.stripe.webhookSecret
      );
    } catch (err) {
      logger.error(`Webhook Error: ${err.message}`);
      throw new AppError(`Webhook Error: ${err.message}`, 400);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      await this.confirmPayment(session);
    }

    return { received: true };
  }

  async confirmPayment(session) {
    const bookingId = session.metadata.bookingId;
    const stripePaymentId = session.payment_intent;

    await prisma.$transaction([
      prisma.payment.update({
        where: { bookingId },
        data: {
          status: 'COMPLETED',
          stripePaymentId,
        },
      }),
      prisma.booking.update({
        where: { id: bookingId },
        data: { status: 'CONFIRMED' },
      }),
    ]);

    logger.info(`Payment confirmed for booking ${bookingId}`);
    // Here we would also trigger email notification
  }
}

export default new StripeService();
