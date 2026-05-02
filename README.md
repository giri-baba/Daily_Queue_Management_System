# Smart Digital Queue Management System with Role-Based Access + Relationship-Based User Management

## Project Overview

Smart Digital Queue Management System, or Smart DQMS, is a beginner-friendly MERN Stack final year project. It helps an organization issue queue tokens, show live queue status, manage staff counters, approve friends or relatives through OTP, authorize token pickup with QR codes, collect feedback, and maintain basic audit logs.

The code is intentionally simple. Controllers are small, routes are easy to read, and the folder structure follows a normal MERN monorepo style.

## Problem Statement

Many offices, hospitals, banks, service centers, and college departments still use manual queues. Manual queues create crowding, confusion, unfair token handling, and poor tracking. Smart DQMS solves this by moving token generation, queue monitoring, staff actions, and relationship-based pickup approval into a digital system.

## Why This Project Is Useful

- Reduces crowding near counters.
- Shows live queue status to users and staff.
- Gives staff simple controls for next, skip, and complete token.
- Allows a verified friend or relative to collect service using QR authorization.
- Gives admins audit logs for basic accountability.
- Demonstrates real-world MERN concepts in a viva-friendly way.

## Real-World Use Cases

- Hospital OPD token management.
- Bank counter queue management.
- Government office visitor queues.
- College admission or exam form counters.
- Passport or document verification offices.
- Customer service centers.

## Features

- User signup and login.
- Staff signup and login.
- Admin login.
- Manager role.
- Role-Based Access Control for Admin, Manager, Staff, and User.
- JWT authentication.
- Google OAuth login.
- OTP verification for friend or relative approval.
- Queue token generation.
- Live queue status using Socket.IO.
- QR code authorization for pickup.
- Feedback module.
- Admin dashboard.
- Staff dashboard.
- Manager dashboard.
- Queue monitoring.
- Next token, complete token, and skip token.
- Basic audit logs.
- MongoDB data storage.

## Complete Workflow

1. A user signs up or logs in.
2. The user generates a queue token.
3. The backend creates a token number and QR code.
4. The live queue screen updates through Socket.IO.
5. Staff calls the next token from the staff dashboard.
6. Staff can complete or skip the current token.
7. A user can add a friend or relative by email.
8. The system generates an OTP for relationship approval.
9. The related person logs in and verifies the OTP.
10. After approval, that person can be used as an authorized collector.
11. Admin and Manager dashboards monitor queue counts and feedback.
12. Admin can view audit logs and create Manager or Admin accounts.

## Data Flow Explanation

Frontend React pages send requests to Express API routes. Express routes call controller functions. Controllers validate the request, check JWT role permissions, read or write MongoDB models, and send Socket.IO events so the frontend updates live.

Example queue flow:

User Dashboard -> POST `/api/queues` -> Queue Controller -> MongoDB QueueToken -> QR Code generation -> Socket.IO queue update -> Live Queue UI refresh.

## System Design

The system uses a simple three-layer design:

- Frontend Layer: React.js pages, forms, dashboards, queue monitor.
- Backend Layer: Node.js, Express.js, JWT middleware, controllers, Socket.IO.
- Data Layer: MongoDB for permanent storage.

## Architecture Diagram Explanation

```text
React Client
  |
  | HTTP requests with JWT
  v
Express API Server ---- Socket.IO ---- Live Queue Screens
  |
  | Reads and writes
  v
MongoDB
```

The React client handles user interaction. Express handles business logic. MongoDB stores users, staff, tokens, relationships, feedback, and audit logs. Socket.IO pushes queue changes instantly to dashboards and monitor screens.

## Tech Stack Explanation

- React.js: Builds the frontend interface.
- Bootstrap: Provides simple responsive styling.
- Node.js: Runs JavaScript on the backend.
- Express.js: Creates REST API routes.
- MongoDB: Stores project data.
- Mongoose: Creates schemas and queries MongoDB.
- JWT: Secures API requests.
- Passport Google OAuth: Supports Google login.
- QRCode: Generates QR authorization image.
- Socket.IO: Sends live queue updates.
- Concurrently: Runs frontend and backend together from root.

## Folder Structure Explanation

```text
smart-dqms/
  client/
    src/
      api/              Axios API setup
      components/       Reusable UI components
      context/          Login session context
      hooks/            Socket.IO queue hook
      pages/            Login, dashboards, feedback, monitor
  server/
    src/
      config/           MongoDB and Google OAuth config
      controllers/      Simple request handling logic
      middleware/       JWT and role checking
      models/           Mongoose schemas
      routes/           API route files
      utils/            JWT, OTP, audit helpers
      app.js            Express app setup
      server.js         HTTP and Socket.IO startup
      seedAdmin.js      Creates the first admin account
  .env                  Shared environment variables
  package.json          Root scripts using concurrently
  README.md
```

## Schema Explanation

### User Model

Stores name, email, password, phone, role, Google ID, and account active status. Roles are Admin, Manager, Staff, and User.

### Staff Model

Stores staff-specific details like department, counter number, linked user account, and manager.

### Role Model

Stores role names and permission labels. This is useful for explaining RBAC even though the app also uses simple role middleware.

### Queue Token Model

Stores token number, queue name, token owner, collector, status, QR code, counter number, and estimated wait time.

### Relationship Model

Stores requester, related person, relation type, OTP, OTP expiry, and approval status.

### Feedback Model

Stores user feedback, rating, message, and optional token reference.

### Audit Log Model

Stores user, role, action, and details for important system activities.

## API Flow

### Authentication

- `POST /api/auth/signup` creates User or Staff accounts.
- `POST /api/auth/login` logs in Admin, Manager, Staff, or User.
- `GET /api/auth/google` starts Google OAuth login.
- `GET /api/auth/google/callback` completes Google OAuth login.
- `POST /api/auth/admin-or-manager` lets Admin create Admin or Manager accounts.

### Queue

- `POST /api/queues` creates a queue token.
- `GET /api/queues` gets live queue status.
- `GET /api/queues/mine` gets logged-in user's tokens.
- `PATCH /api/queues/next` calls next token.
- `PATCH /api/queues/:id/complete` completes a token.
- `PATCH /api/queues/:id/skip` skips a token.

### Relationships

- `POST /api/relationships` adds a friend or relative request.
- `POST /api/relationships/verify` verifies OTP.
- `GET /api/relationships` lists relationship records.

### Feedback

- `POST /api/feedback` submits feedback.
- `GET /api/feedback` lets Admin or Manager view feedback.

### Dashboard and Audit

- `GET /api/dashboard/stats` returns dashboard counts.
- `GET /api/audit-logs` returns recent audit logs for Admin.

## Setup Steps

### Requirements

- Node.js
- MongoDB
- Google OAuth credentials for real Google login

### Installation Guide

Install all dependencies from the root folder:

```bash
npm run install-all
```

Update `.env` values if needed:

```text
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/smart_dqms
JWT_SECRET=change_this_secret_for_production
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
OTP_API_KEY=demo_otp_key
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_app_password
CLIENT_URL=http://localhost:5173
```

Create the first admin account:

```bash
npm run seed --prefix server
```

Default admin:

```text
Email: admin@dqms.com
Password: Admin@123
```

### How To Run Project

Run frontend and backend together:

```bash
npm run dev
```

Open:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:5000
```

## Demo Login Flow

1. Run MongoDB.
2. Install dependencies.
3. Seed admin.
4. Log in as admin.
5. Create a manager from Admin Dashboard.
6. Sign up as staff from Staff Signup.
7. Sign up as user from User Signup.
8. Generate a queue token from User Dashboard.
9. Open Live Queue Monitor.
10. Use Staff Dashboard to call next, complete, or skip token.
11. Add relationship, verify OTP, and explain QR authorization.
12. Submit feedback and view it in Manager Dashboard.

## Future Scope

- Email notification for token status.
- Counter-wise queue separation.
- Appointment booking.
- Payment gateway for paid services.
- Better analytics charts.
- QR scanner page for staff.
- Push notifications.
- Docker setup.
- Unit and integration tests.

## OTP Verification Setup

This project uses Nodemailer email OTP for account verification and password reset.

### Email OTP With Nodemailer

Email OTP is used for:

- Signup email verification
- Resend email verification OTP
- Forgot password OTP
- Reset password

The backend stores only the hashed OTP in MongoDB. Plain OTP is sent by email and expires in 10 minutes.

Add these values in the root `.env` file:

```text
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_FROM="Smart DQMS <your_email@gmail.com>"
```

For Gmail, enable 2-Step Verification and create an App Password. Use the app password as `EMAIL_PASS`, not your normal Gmail password.

For Brevo SMTP, use:

```text
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_USER=your_brevo_login
EMAIL_PASS=your_brevo_smtp_key
EMAIL_FROM="Smart DQMS <verified_sender@example.com>"
```

### New OTP APIs

```text
POST /api/auth/verify-email
POST /api/auth/resend-email-otp
POST /api/auth/forgot-password
POST /api/auth/reset-password
GET  /api/auth/profile
GET  /api/auth/users/verification-status
```

### Frontend OTP Pages

```text
/verify-otp
/forgot-password
/reset-password
/profile
```

### Install New Server Packages

```bash
npm install --prefix server nodemailer
```

Or reinstall all packages:

```bash
npm run install-all
```

### Testing Steps

1. Start MongoDB.
2. Fill SMTP values in `.env`.
3. Run `npm install --prefix server nodemailer`.
4. Run `npm run dev`.
5. Signup as a user.
6. Check email inbox for OTP.
7. Verify email OTP.
8. Login.
9. Open Profile and confirm email verification badge.
10. Generate queue token.
11. Test forgot password from login page.

### Common Error Fixes

- `Invalid login`: Check `EMAIL_USER` and `EMAIL_PASS`. Gmail needs an App Password.
- `Email not received`: Check spam folder and verify `EMAIL_FROM`.
- `Login blocked`: Verify email OTP first.
- `Queue token blocked`: Verify email OTP first.

### Admin Verification Rule

The seeded admin does not need OTP verification. Running the seed script marks the default admin as active and email verified:

```bash
npm run seed --prefix server
```

Any new User or Staff account created from signup must verify email OTP before login. Admin-created Admin or Manager accounts are trusted admin-created accounts and are marked email verified automatically.

## Viva Explanation Points

- This is a MERN Stack project using React, Node, Express, and MongoDB.
- JWT protects private routes.
- Role middleware controls Admin, Manager, Staff, and User access.
- Socket.IO gives live queue updates.
- OTP verification approves relationship-based token pickup.
- QR code stores authorization information for token collection.
- Audit logs record important actions.
- The architecture is simple enough to explain but realistic enough for a final year project.
