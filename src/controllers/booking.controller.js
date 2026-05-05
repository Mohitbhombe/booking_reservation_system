import bookingService from '../services/booking.service.js';
import { catchAsync } from '../middleware/errorHandler.js';

export const createBooking = catchAsync(async (req, res) => {
  const { resourceId, startDate, endDate } = req.body;
  const booking = await bookingService.createBooking(
    req.user.id,
    resourceId,
    startDate,
    endDate
  );

  res.status(201).json({
    status: 'success',
    data: booking,
  });
});

export const getMyBookings = catchAsync(async (req, res) => {
  const bookings = await bookingService.getUserBookings(req.user.id);
  res.status(200).json({
    status: 'success',
    results: bookings.length,
    data: bookings,
  });
});

export const getBooking = catchAsync(async (req, res) => {
  const booking = await bookingService.getBookingById(
    req.params.id,
    req.user.id,
    req.user.role
  );
  res.status(200).json({
    status: 'success',
    data: booking,
  });
});

export const cancelBooking = catchAsync(async (req, res) => {
  const booking = await bookingService.cancelBooking(req.params.id, req.user.id);
  res.status(200).json({
    status: 'success',
    data: booking,
  });
});
