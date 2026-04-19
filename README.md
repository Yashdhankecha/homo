# Homoecare (React + Node + MongoDB Atlas)

Monorepo with:
- `client`: React (Vite) patient site + admin dashboard
- `server`: Express + MongoDB Atlas API

## Quick Start

1. Install dependencies

```bash
cd server && npm install
cd ../client && npm install
```

2. Configure env

- Copy `server/.env.example` to `server/.env`
- Fill `MONGODB_URI`, `JWT_SECRET`, `DOCTOR_EMAIL`, `DOCTOR_PASSWORD`

3. Seed doctor user

```bash
cd server
npm run seed
```

4. Run backend

```bash
npm run dev
```

5. Run frontend

```bash
cd ../client
npm run dev
```

## API

- `POST /api/auth/login`
- `GET /api/appointments` (admin token)
- `POST /api/appointments` (public booking)
- `GET /api/appointments/stats` (admin token)
- `GET /api/appointments/today` (admin token)
- `PATCH /api/appointments/:id/status` (admin token)
- `POST /api/messages/log` (admin token)
- `GET /api/messages/log` (admin token)
- `GET /api/settings` (admin token)
- `PUT /api/settings` (admin token)

## Notes

- This baseline includes a complete patient booking flow and admin modules for dashboard, appointments, messages, and settings.
