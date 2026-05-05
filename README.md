# Booking Reservation System API

This is a complete backend API project scaffold for a booking reservation system.

## Tech Stack

- Node.js + Express + TypeScript
- MongoDB + Mongoose
- JWT Authentication
- Stripe payment integration
- Nodemailer email notifications
- Swagger API docs
- Jest + Supertest testing

## Week-by-Week Step-by-Step Plan

### Week 1: Environment Setup and Initial API Design
1. Clone repo and install dependencies:
   - `npm install`
2. Copy env template:
   - `copy .env.example .env`
3. Update `.env` with your values.
4. Run project:
   - `npm run dev`
5. Check health endpoint:
   - `GET http://localhost:5000/health`

### Week 2: Database Integration and Resource Management
1. Configure `MONGO_URI` in `.env`.
2. Start MongoDB and server.
3. Create admin user directly in DB (or by script), set role `admin`.
4. Use resource endpoints:
   - `POST /api/resources` (admin)
   - `GET /api/resources`
   - `PUT /api/resources/:id` (admin)
   - `DELETE /api/resources/:id` (admin)

### Week 3: Booking Management and Validation
1. Register/login customer:
   - `POST /api/auth/register`
   - `POST /api/auth/login`
2. Create booking:
   - `POST /api/bookings`
3. Slot overlap validation is handled automatically.
4. Fetch own bookings:
   - `GET /api/bookings/my`
5. Cancel booking:
   - `PATCH /api/bookings/:id/cancel`

### Week 4: Payment Integration using Stripe
1. Add Stripe key in `.env`:
   - `STRIPE_SECRET_KEY=...`
2. Create payment intent for a booking:
   - `POST /api/payments/bookings/:bookingId/payment-intent`
3. Use returned `clientSecret` on frontend checkout flow.

### Week 5: Email Notification with Nodemailer
1. Configure SMTP in `.env`:
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM`
2. Booking creation triggers confirmation email.
3. If SMTP is missing, API safely skips sending emails in local.

### Week 6: Authentication and Authorization
1. JWT token generated on login/register.
2. Use header:
   - `Authorization: Bearer <token>`
3. Role-based access:
   - Admin only for resource create/update/delete.

### Week 7: API Documentation and Testing
1. Open Swagger docs:
   - `http://localhost:5000/api/docs`
2. Run tests:
   - `npm test`
3. Add more tests for auth, booking overlap, and payment errors.

### Week 8: Deployment and Final Review
1. Build app:
   - `npm run build`
2. Start production:
   - `npm start`
3. Deploy to Render/Railway/Azure App Service.
4. Add production MongoDB and Stripe secrets in deployment env.

## Scripts

- `npm run dev` - Start dev server
- `npm run build` - Compile TypeScript
- `npm start` - Run compiled server
- `npm test` - Run tests

## Main Endpoints

- `GET /health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/resources`
- `POST /api/resources` (admin)
- `POST /api/bookings`
- `GET /api/bookings/my`
- `PATCH /api/bookings/:id/cancel`
- `POST /api/payments/bookings/:bookingId/payment-intent`
