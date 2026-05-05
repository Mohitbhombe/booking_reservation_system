import { Request, Response } from "express";
import { Booking } from "../models/Booking";
import { createPaymentIntent } from "../services/paymentService";

export const createBookingPaymentIntent = async (req: Request, res: Response): Promise<void> => {
  const booking = await Booking.findOne({ _id: req.params.bookingId, user: req.user?.id });
  if (!booking) {
    res.status(404).json({ message: "Booking not found" });
    return;
  }

  const intent = await createPaymentIntent(Math.round(booking.totalAmount * 100), "inr");

  booking.paymentIntentId = intent.id;
  booking.status = "confirmed";
  await booking.save();

  res.status(200).json({
    clientSecret: intent.client_secret,
    paymentIntentId: intent.id
  });
};
