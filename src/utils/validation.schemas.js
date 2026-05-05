import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(2),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
});

export const createResourceSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    description: z.string().optional(),
    price: z.number().positive(),
    availabilityCount: z.number().int().nonnegative(),
  }),
});

export const createBookingSchema = z.object({
  body: z.object({
    resourceId: z.string().uuid(),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
  }),
});
