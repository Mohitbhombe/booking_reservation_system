import { Router } from "express";
import { body } from "express-validator";
import { cancelBooking, createBooking, getMyBookings } from "../controllers/bookingController";
import { protect } from "../middleware/auth";

const router = Router();

router.use(protect);
router.post(
  "/",
  [
    body("resourceId").notEmpty(),
    body("startTime").isISO8601(),
    body("endTime").isISO8601()
  ],
  createBooking
);
router.get("/my", getMyBookings);
router.patch("/:id/cancel", cancelBooking);

export default router;
