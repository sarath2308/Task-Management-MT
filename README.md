# Task Management App

A full-stack **Task Management** application built with the MERN stack, featuring JWT-based authentication with OTP email verification, real-time updates via Socket.io, and task analytics with interactive charts.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, React Query, React Hook Form, Zod, Socket.io-client, Recharts |
| **Backend** | Node.js, Express, TypeScript, Inversify (DI), Zod |
| **Database** | MongoDB Atlas (Mongoose) |
| **Cache / OTP** | Redis (RedisLabs) |
| **Auth** | JWT (Access + Refresh tokens via HTTP-only cookies) |
| **Email** | Nodemailer (Gmail SMTP) |
| **Real-time** | Socket.io |
| **Cloud (Prod)** | AWS SSM Parameter Store, Docker, EC2 |

---

## Project Structure

```
Task-Management-MT/
├── backend/          # Express + TypeScript API
│   ├── src/
│   │   ├── config/   # MongoDB, Redis, SSM config
│   │   ├── controller/
│   │   ├── services/
│   │   ├── repo/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── model/
│   │   ├── schema/   # Zod schemas
│   │   ├── di/       # Inversify DI container
│   │   └── server.ts
│   └── .env
├── frontend/         # React + Vite SPA
│   ├── src/
│   │   ├── api/      # Axios API layer
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hook/     # React Query hooks
│   │   ├── schemas/  # Zod form schemas
│   │   └── main.tsx
│   └── .env
└── docker-compose.yml
```

---

## Getting Started (Local Development)

### Prerequisites

- Node.js >= 18
- npm >= 9
- A running MongoDB Atlas cluster
- A running Redis instance (RedisLabs or local)

### 1. Clone the repo

```bash
git clone https://github.com/sarath2308/Task-Management-MT.git
cd Task-Management-MT
```

### 2. Configure Backend Environment

Create `backend/.env`:

```env
NODE_ENV=development

ACCESS_TOKEN_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_secret

DB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/task-management

FRONTEND_URL=http://localhost:5173

REDIS_HOST=your-redis-host
REDIS_PORT=13066
REDIS_PASSWORD=your_redis_password

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password
```

> **Important:** Set `NODE_ENV=development` locally. This skips the AWS SSM call and uses `.env` directly. Without this, the server hangs at startup because it cannot reach AWS SSM.

### 3. Configure Frontend Environment

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 4. Install Dependencies

```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 5. Run the App

```bash
# Terminal 1 — Backend (runs on port 5000)
cd backend
npm run dev

# Terminal 2 — Frontend (runs on port 5173)
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Authentication Flow

1. **Signup** → User submits name, email, password → OTP sent via email → Redirect to OTP verification page.
2. **OTP Verify** → User enters OTP → Account created → Redirect to home.
3. **Login** → Email + password → Access token (short-lived) + Refresh token set as HTTP-only cookies.
4. **Token Refresh** → Axios interceptor automatically calls `/auth/refresh-token` on 401 responses (except for auth endpoints themselves).

---

## Production Deployment

In production (`NODE_ENV=production`), environment variables are loaded from **AWS SSM Parameter Store** at path `/task-management/dev/`. Mount AWS credentials via Docker volume:

```yaml
# docker-compose.yml
volumes:
  - ~/.aws:/root/.aws
```

Build and run with Docker:

```bash
docker-compose up --build
```

---

## Key Features

- ✅ JWT authentication with HTTP-only cookie refresh tokens
- ✅ OTP email verification on signup (Redis-backed TTL)
- ✅ Real-time task updates via Socket.io
- ✅ Task analytics with Recharts
- ✅ Dependency Injection with Inversify
- ✅ Zod schema validation on both frontend and backend
- ✅ AWS SSM integration for production secrets (skipped locally)
