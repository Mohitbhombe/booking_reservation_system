import Stripe from "stripe";
import { env } from "../config/env";

const stripe = env.stripeSecretKey
  ? new Stripe(env.stripeSecretKey)
  : null;

export const createPaymentIntent = async (amount: number, currency = "inr") => {
  if (!stripe) {
    throw new Error("Stripe is not configured. Set STRIPE_SECRET_KEY.");
  }

  return stripe.paymentIntents.create({
    amount,
    currency,
    automatic_payment_methods: { enabled: true }
  });
};
