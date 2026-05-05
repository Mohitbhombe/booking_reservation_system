import { Request, Response } from "express";
import mongoose from "mongoose";
import { validationResult } from "express-validator";
import { Booking } from "../models/Booking";
import { Resource } from "../models/Resource";
import { User } from "../models/User";
import { sendBookingEmail } from "../services/emailService";

export const createBooking = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { resourceId, startTime, endTime } = req.body;
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (start >= end) {
    res.status(400).json({ message: "End time must be after start time" });
    return;
  }

  const resource = await Resource.findById(resourceId);
  if (!resource || !resource.isActive) {
    res.status(404).json({ message: "Resource not available" });
    return;
  }

  const overlap = await Booking.findOne({
    resource: new mongoose.Types.ObjectId(resourceId),
    status: { $ne: "cancelled" },
    startTime: { $lt: end },
    endTime: { $gt: start }
  });

  if (overlap) {
    res.status(409).json({ message: "Selected slot is already booked" });
    return;
  }

  const hours = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60));
  const totalAmount = hours * resource.pricePerHour;

  const booking = await Booking.create({
    user: req.user?.id,
    resource: resource._id,
    startTime: start,
    endTime: end,
    totalAmount
  });

  const user = await User.findById(req.user?.id);
  if (user) {
    await sendBookingEmail(
      user.email,
      "Booking Created",
      `<p>Your booking is created for ${resource.name}.</p><p>Total amount: ${totalAmount}</p>`
    );
  }

  res.status(201).json(booking);
};

export const getMyBookings = async (req: Request, res: Response): Promise<void> => {
  const bookings = await Booking.find({ user: req.user?.id }).populate("resource").sort({ createdAt: -1 });
  res.status(200).json(bookings);
};

export const cancelBooking = async (req: Request, res: Response): Promise<void> => {
  const booking = await Booking.findOneAndUpdate(
    { _id: req.params.id, user: req.user?.id },
    { status: "cancelled" },
    { new: true }
  );

  if (!booking) {
    res.status(404).json({ message: "Booking not found" });
    return;
  }

  res.status(200).json(booking);
};
