# Task Management Application

A production-ready, full-stack task management platform built with modern technologies and architectural best practices. This application demonstrates clean code principles, scalable architecture, real-time capabilities, and enterprise-grade security patterns.

## Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Authentication & Security](#authentication--security)
- [Real-Time Features](#real-time-features)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Key Technical Decisions](#key-technical-decisions)
- [Performance & Optimization](#performance--optimization)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

This project is a comprehensive task management system designed for teams to collaborate and track work efficiently. Built with a focus on scalability, maintainability, and user experience, it showcases professional-grade full-stack development practices.

### Use Cases

- **Team Collaboration**: Manage tasks in real-time with team members
- **Task Analytics**: Visualize task completion metrics and productivity trends
- **Secure Authentication**: Enterprise-grade security with JWT and OTP verification
- **Real-Time Updates**: Instant task synchronization across connected clients

---

## Technology Stack

| Layer | Technology | Justification |
|---|---|---|
| **Frontend** | React 19, TypeScript, Vite | Modern UI with type safety and optimized build process |
| **State Management** | React Query, React Hook Form | Server state sync and form management with minimal boilerplate |
| **Validation** | Zod | Type-safe schema validation for end-to-end data integrity |
| **Real-Time Communication** | Socket.io | Bi-directional, event-driven communication for live updates |
| **Backend Runtime** | Node.js 18+ | JavaScript ecosystem with non-blocking I/O |
| **Framework** | Express.js + TypeScript | Lightweight, flexible framework with type safety |
| **Dependency Injection** | Inversify | Decoupled architecture, improved testability |
| **Database** | MongoDB Atlas + Mongoose | Document-based, scalable data model |
| **Caching & Sessions** | Redis | High-performance in-memory store for OTP and caching |
| **Authentication** | JWT (Access + Refresh tokens) | Stateless, scalable session management |
| **Email Service** | Nodemailer + Gmail SMTP | Reliable transactional email delivery |
| **Containerization** | Docker + Docker Compose | Reproducible, portable deployment environment |
| **Cloud Infrastructure** | AWS (SSM, EC2) | Secure parameter management and compute |

---

## Architecture

### System Design

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React + Vite)                 │
│              (Running on localhost:5173 / Production URL)       │
└──────────────────────────┬──────────────────────────────────────┘
                           │
              ┌────────────┴────────────┐
              │                         │
        ┌─────▼─────┐          ┌───────▼────────┐
        │ REST API  │          │  WebSocket     │
        │ (HTTP)    │          │  (Socket.io)   │
        └─────┬─────┘          └───────┬────────┘
              │                         │
              └────────────┬────────────┘
                           │
        ┌──────────────────▼──────────────────┐
        │     Backend (Express + TypeScript)  │
        │        (Running on port 5000)       │
        │                                     │
        │  ┌─────────────────────────────┐   │
        │  │ API Routes & Controllers    │   │
        │  ├─────────────────────────────┤   │
        │  │ Services (Business Logic)   │   │
        │  ├─────────────────────────────┤   │
        │  │ Repository Layer (Data)     │   │
        │  ├─────────────────────────────┤   │
        │  │ Middleware (Auth, Validation)   │
        │  └─────────────────────────────┘   │
        └──────────────────┬──────────────────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
        ┌─────▼──────┐ ┌──▼─────┐ ┌───▼─────┐
        │  MongoDB   │ │ Redis  │ │ AWS SSM │
        │   Atlas    │ │ Cache  │ │ Secrets │
        └────────────┘ └────────┘ └─────────┘
```

### Layered Architecture

**Frontend:**
- Components: UI presentation layer
- Pages: Route-specific containers
- Hooks: React Query for server state management
- API: Abstracted HTTP client with interceptors
- Schemas: Zod validation for forms

**Backend:**
- Controllers: Request/Response handling
- Services: Business logic and orchestration
- Repository: Data access abstraction
- Middleware: Cross-cutting concerns (auth, validation, error handling)
- Models: Data schemas and types

---

## Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x (or yarn/pnpm)
- **Git**
- **MongoDB Atlas** account with a cluster
- **Redis** instance (RedisLabs or local)
- **Gmail account** with App Password for SMTP (or alternative email service)

### Installation & Setup

#### 1. Clone Repository

```bash
git clone https://github.com/sarath2308/Task-Management-MT.git
cd Task-Management-MT
```

#### 2. Configure Backend Environment

Create `backend/.env`:

```env
# Environment
NODE_ENV=development

# JWT Secrets (Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
ACCESS_TOKEN_SECRET=your-secure-access-token-secret-here
REFRESH_TOKEN_SECRET=your-secure-refresh-token-secret-here

# Database
DB_URI=mongodb+srv://username:password@cluster.mongodb.net/task-management?retryWrites=true&w=majority

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Redis Configuration
REDIS_HOST=your-redis-host.com
REDIS_PORT=13066
REDIS_PASSWORD=your-redis-password

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password

# Server Configuration
PORT=5000
```

**⚠️ Important:** `NODE_ENV=development` is required locally to disable AWS SSM lookups.

#### 3. Configure Frontend Environment

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

#### 4. Install Dependencies

```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

#### 5. Start Development Servers

```bash
# Terminal 1: Backend (API + WebSocket)
cd backend
npm run dev
# Server runs on http://localhost:5000

# Terminal 2: Frontend (React development server)
cd frontend
npm run dev
# Application available at http://localhost:5173
```

---

## API Documentation

### Authentication Endpoints

#### POST `/api/auth/signup`
Register a new user with email verification.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "OTP sent to your email"
}
```

#### POST `/api/auth/verify-otp`
Verify OTP and complete registration.

**Request:**
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Account created successfully",
  "tokens": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

#### POST `/api/auth/login`
Authenticate user and issue tokens.

**Request:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "user": { "id": "...", "name": "John Doe", "email": "john@example.com" },
  "tokens": { "accessToken": "...", "refreshToken": "..." }
}
```

#### POST `/api/auth/refresh-token`
Refresh expired access token using refresh token (HTTP-only cookie).

**Response:** `200 OK`
```json
{
  "success": true,
  "accessToken": "eyJhbGc..."
}
```

### Task Endpoints

#### GET `/api/tasks`
Retrieve all tasks for authenticated user.

**Response:** `200 OK`
```json
{
  "success": true,
  "tasks": [
    {
      "id": "507f1f77bcf86cd799439011",
      "title": "Complete project",
      "description": "Finish the task management app",
      "status": "in-progress",
      "priority": "high",
      "dueDate": "2026-05-15T00:00:00Z",
      "createdAt": "2026-05-07T10:30:00Z",
      "updatedAt": "2026-05-07T10:30:00Z"
    }
  ]
}
```

#### POST `/api/tasks`
Create a new task.

**Request:**
```json
{
  "title": "New Task",
  "description": "Task description",
  "priority": "high",
  "dueDate": "2026-05-15T00:00:00Z"
}
```

#### PUT `/api/tasks/:id`
Update existing task.

#### DELETE `/api/tasks/:id`
Delete a task.

---

## Authentication & Security

### Security Architecture

1. **JWT Token Strategy**
   - **Access Token**: Short-lived (15 minutes), included in Authorization header
   - **Refresh Token**: Long-lived (7 days), stored in HTTP-only, Secure, SameSite cookies
   - Automatic token rotation via Axios interceptors

2. **Password Security**
   - Bcrypt hashing with salt rounds: 12
   - Secure password validation on every login

3. **OTP Verification**
   - 6-digit OTP generated during signup
   - Redis-backed TTL (5 minutes expiration)
   - One-time use enforcement

4. **Input Validation**
   - Zod schemas on frontend and backend
   - Server-side re-validation on all endpoints
   - Protection against injection attacks

5. **CORS & CSRF Protection**
   - Configured CORS for frontend origin only
   - CSRF tokens on state-changing operations
   - HTTP-only cookies prevent XSS token theft

6. **Environment Variables**
   - Development: `.env` file
   - Production: AWS SSM Parameter Store (encrypted, rotated centrally)

---

## Real-Time Features

### Socket.io Integration

WebSocket connections enable real-time task updates across all connected clients:

- **Task Created**: Instant notification to all users
- **Task Updated**: Live status/priority changes reflected immediately
- **Task Deleted**: Removal propagated to connected clients
- **User Presence**: See who's currently active

**Event Format:**
```typescript
// Server emits
socket.emit('task:created', { task: {...}, timestamp: Date })
socket.emit('task:updated', { taskId: '...', updates: {...} })
socket.emit('task:deleted', { taskId: '...' })

// Client listens
socket.on('task:created', handleTaskCreated)
socket.on('task:updated', handleTaskUpdated)
socket.on('task:deleted', handleTaskDeleted)
```

---

## Deployment

### Docker Containerization

Build and run using Docker Compose:

```bash
docker-compose up --build
```

**Features:**
- Multi-stage builds for optimized images
- Environment variable injection
- Volume mounting for AWS credentials in production

### Production Deployment

In production (`NODE_ENV=production`):

1. **Environment Variables** are fetched from AWS SSM Parameter Store at startup
2. **AWS Credentials** must be mounted: `~/.aws:/root/.aws`
3. **SSL/TLS** handled by load balancer (e.g., AWS ALB)
4. **Database**: MongoDB Atlas with IP whitelisting
5. **Redis**: Managed Redis service with encryption in transit

**Docker Compose Configuration:**
```yaml
services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    environment:
      NODE_ENV: production
    volumes:
      - ~/.aws:/root/.aws:ro
    ports:
      - "5000:5000"
    depends_on:
      - mongodb
      - redis

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "80:3000"
```

---

## Project Structure

```
Task-Management-MT/
├── backend/
│   ├── src/
│   │   ├── config/              # External service configurations
│   │   │   ├── mongodb/         # MongoDB/Mongoose setup
│   │   │   ├── redis/           # Redis connection
│   │   │   └── ssm.config.ts    # AWS SSM secrets loading
│   │   ├── controller/          # Route handlers
│   │   │   ├── auth.controller.ts
│   │   │   └── task.controller.ts
│   │   ├── services/            # Business logic
│   │   │   ├── auth.service.ts
│   │   │   ├── task.service.ts
│   │   │   └── user.service.ts
│   │   ├── repo/                # Data access layer
│   │   │   ├── base/            # Generic repository pattern
│   │   │   ├── user.repo.ts
│   │   │   └── task.repo.ts
│   │   ├── middleware/          # Express middleware
│   │   │   ├── auth.middleware.ts
│   │   │   ├── error.handler.ts
│   │   │   └── zod.validation.middleware.ts
│   │   ├── routes/              # API route definitions
│   │   ├── schema/              # Zod validation schemas
│   │   ├── model/               # Mongoose models
│   │   ├── di/                  # Inversify DI container
│   │   ├── socket/              # WebSocket handlers
│   │   ├── utils/               # Utility functions
│   │   ├── types/               # TypeScript type definitions
│   │   ├── constant/            # Application constants
│   │   ├── interface/           # Service interfaces
│   │   ├── error/               # Custom error classes
│   │   └── server.ts            # Express app entry point
│   ├── Dockerfile
│   ├── tsconfig.json
│   ├── eslint.config.mts
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/                 # API client layer
│   │   │   ├── api.ts           # Axios instance with interceptors
│   │   │   ├── auth.api.ts
│   │   │   └── task.api.ts
│   │   ├── components/          # Reusable React components
│   │   ├── pages/               # Route-specific page components
│   │   ├── hooks/               # Custom React hooks
│   │   │   └── tasks/           # React Query hooks for tasks
│   │   ├── routes/              # React Router configuration
│   │   ├── schemas/             # Zod form schemas
│   │   ├── socket/              # Socket.io client setup
│   │   ├── assets/              # Static files
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── eslint.config.js
│   └── package.json
│
├── docker-compose.yml           # Multi-container orchestration
└── README.md
```

---

## Key Technical Decisions

### 1. **Dependency Injection (Inversify)**
- **Why**: Decouples services from their implementations, improves testability
- **Trade-off**: Slight performance overhead, learning curve for team
- **Alternative Considered**: Manual factory functions (simpler but less scalable)

### 2. **Zod Validation**
- **Why**: Type-safe schemas in TypeScript, compile-time and runtime validation
- **Trade-off**: Larger bundle size than alternatives
- **Alternative Considered**: Joi (more powerful but heavier)

### 3. **React Query for Server State**
- **Why**: Automatic caching, background refetching, optimistic updates
- **Trade-off**: Additional dependency, learning curve
- **Alternative Considered**: Redux (overkill for this project)

### 4. **JWT with Refresh Token Pattern**
- **Why**: Stateless sessions, secure token rotation without database queries
- **Trade-off**: Requires client-side token management
- **Alternative Considered**: Session-based auth (simpler but less scalable)

### 5. **Repository Pattern**
- **Why**: Data access abstraction, testable services, easy database migration
- **Trade-off**: Extra abstraction layer
- **Alternative Considered**: Direct service queries to MongoDB

### 6. **Socket.io for Real-Time Updates**
- **Why**: Fallback to polling if WebSocket unavailable, familiar API
- **Trade-off**: More overhead than native WebSockets
- **Alternative Considered**: Raw WebSockets (lighter but no fallback)

---

## Performance & Optimization

### Frontend Optimization

- **Code Splitting**: Route-based lazy loading with React Router
- **Vite**: Lightning-fast development experience with Hot Module Replacement (HMR)
- **React Query**: Automatic caching and stale-while-revalidate patterns
- **Zod Parsing**: Minimized schema re-validation

### Backend Optimization

- **Connection Pooling**: MongoDB connection pool (default: 10 connections)
- **Redis Caching**: Session/OTP storage with TTL expiration
- **Middleware Ordering**: Authentication before business logic processing
- **Error Handling**: Structured error responses without data leaks

### Database Optimization

- **Indexes**: Recommended on `email`, `userId` for frequent queries
- **Document Structure**: Denormalized task data for read performance
- **TTL Indexes**: Automatic OTP cleanup via Redis expiration

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Submit a Pull Request

### Code Standards

- **TypeScript**: Strict mode enabled
- **Linting**: ESLint configuration enforced
- **Formatting**: Prettier for consistent code style
- **Testing**: Unit tests for services (recommended)

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Support & Documentation

For issues, feature requests, or questions:
- Open an GitHub Issue
- Check existing documentation in the codebase
- Review API documentation above

---

**Last Updated**: May 2026 | **Status**: Production Ready
