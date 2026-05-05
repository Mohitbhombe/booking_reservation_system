import { Router } from "express";
import { createBookingPaymentIntent } from "../controllers/paymentController";
import { protect } from "../middleware/auth";

const router = Router();

router.post("/bookings/:bookingId/payment-intent", protect, createBookingPaymentIntent);

export default router;
