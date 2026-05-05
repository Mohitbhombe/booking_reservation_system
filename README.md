# Booking Reservation System API

A production-ready, full-stack backend API for a Booking Reservation System.

## Tech Stack
- **Backend**: Node.js (Express.js)
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: JWT (Access + Refresh tokens)
- **Payments**: Stripe
- **Email**: Nodemailer (SMTP)
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest + Supertest
- **Containerization**: Docker

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment Variables
Copy `.env.example` to `.env` and fill in your details:
```bash
cp .env.example .env
```

### 3. Database Migration
Ensure you have a PostgreSQL instance running and the `DATABASE_URL` is set in `.env`.
```bash
npx prisma migrate dev --name init
```

### 4. Run the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

### 5. Access Documentation
Once the server is running, visit:
`http://localhost:3000/api-docs`

## Docker Setup
To run the entire stack (API + Database) using Docker:
```bash
docker-compose up --build
```

## Testing
```bash
npm test
```

## Features
- **User Authentication**: Register, Login, Refresh Token, Logout.
- **Role-Based Access**: Admins can manage resources (CRUD).
- **Booking Management**: Users can create, view, and cancel bookings.
- **Availability Logic**: Prevents double bookings and validates dates.
- **Payment Integration**: Stripe Checkout and Webhooks.
- **Notifications**: Automated emails for confirmations and cancellations.
- **Security**: Rate limiting, Helmet, CORS, and Zod validation.
- **Logging**: Winston logger for debugging and monitoring.

## API Endpoints Summary

### Auth
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`

### Resources
- `GET /api/v1/resources` (Public)
- `GET /api/v1/resources/:id` (Public)
- `POST /api/v1/resources` (Admin)
- `PATCH /api/v1/resources/:id` (Admin)
- `DELETE /api/v1/resources/:id` (Admin)

### Bookings
- `POST /api/v1/bookings` (User)
- `GET /api/v1/bookings/my-bookings` (User)
- `GET /api/v1/bookings/:id` (User/Admin)
- `PATCH /api/v1/bookings/:id/cancel` (User)

### Payments
- `POST /api/v1/payments/create-checkout-session`
- `POST /api/v1/payments/webhook` (Public - Stripe signature required)
