import prisma from '../prisma/client.js';
import { AppError } from '../middleware/errorHandler.js';

class BookingService {
  async createBooking(userId, resourceId, startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      throw new AppError('End date must be after start date', 400);
    }

    // Check resource existence and availability
    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
    });

    if (!resource) {
      throw new AppError('Resource not found', 404);
    }

    // Check for overlapping bookings
    const overlappingBookings = await prisma.booking.count({
      where: {
        resourceId,
        status: { in: ['PENDING', 'CONFIRMED'] },
        OR: [
          {
            startDate: { lte: start },
            endDate: { gte: start },
          },
          {
            startDate: { lte: end },
            endDate: { gte: end },
          },
          {
            startDate: { gte: start },
            endDate: { lte: end },
          },
        ],
      },
    });

    if (overlappingBookings >= resource.availabilityCount) {
      throw new AppError('Resource is not available for these dates', 400);
    }

    // Calculate total price (simplified: price * days)
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) || 1;
    const totalPrice = parseFloat(resource.price) * days;

    return await prisma.booking.create({
      data: {
        userId,
        resourceId,
        startDate: start,
        endDate: end,
        totalPrice,
        status: 'PENDING',
      },
      include: {
        resource: true,
      },
    });
  }

  async getUserBookings(userId) {
    return await prisma.booking.findMany({
      where: { userId },
      include: { resource: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getBookingById(id, userId, role) {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { resource: true, payment: true },
    });

    if (!booking) {
      throw new AppError('Booking not found', 404);
    }

    if (role !== 'ADMIN' && booking.userId !== userId) {
      throw new AppError('You do not have permission to view this booking', 403);
    }

    return booking;
  }

  async cancelBooking(id, userId) {
    const booking = await this.getBookingById(id, userId, 'USER');

    if (booking.status === 'CANCELLED') {
      throw new AppError('Booking is already cancelled', 400);
    }

    return await prisma.booking.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
  }
}

export default new BookingService();
