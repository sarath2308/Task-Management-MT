# Frontend — Task Management App

React + TypeScript + Vite frontend for the Task Management application.

## Stack

- **React 19** with TypeScript
- **Vite** — dev server & bundler
- **React Query** (`@tanstack/react-query`) — server state management
- **React Hook Form** + **Zod** — form handling & validation
- **Socket.io-client** — real-time updates
- **Recharts** — task analytics charts
- **React Hot Toast** — notifications
- **React Router DOM** — client-side routing

## Setup

```bash
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## Development

```bash
npm run dev
```

Runs on [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
```

## Project Structure

```
src/
├── api/          # Axios instances and API call functions
├── components/   # Shared UI components (Login, Signup, Layout, etc.)
├── pages/        # Route-level page components
├── hook/         # React Query custom hooks
│   ├── auth/     # Auth-related hooks (login, signup, OTP, etc.)
│   └── tasks/    # Task CRUD hooks
├── schemas/      # Zod validation schemas
└── main.tsx
```
