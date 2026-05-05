import stripeService from '../services/stripe.service.js';
import { catchAsync } from '../middleware/errorHandler.js';

export const createCheckoutSession = catchAsync(async (req, res) => {
  const { bookingId } = req.body;
  const session = await stripeService.createCheckoutSession(bookingId, req.user.id);

  res.status(200).json({
    status: 'success',
    url: session.url,
  });
});

export const stripeWebhook = catchAsync(async (req, res) => {
  const signature = req.headers['stripe-signature'];
  const result = await stripeService.handleWebhook(signature, req.body);

  res.status(200).json(result);
});
