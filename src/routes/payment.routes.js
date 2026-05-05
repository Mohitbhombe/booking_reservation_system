import express from 'express';
import * as paymentController from '../controllers/payment.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Webhook must be before protect and use express.raw
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  paymentController.stripeWebhook
);

router.use(protect);
router.post('/create-checkout-session', paymentController.createCheckoutSession);

export default router;
