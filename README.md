# TaskFlow - Task Management System

TaskFlow is a portfolio-ready MERN app for organizing projects, tasks, deadlines, ownership, and team progress. It includes JWT registration/login, project CRUD, task CRUD, assignment to registered teammates, status and priority, optional comments, project completion percentages, and a responsive dark dashboard.

## Stack

- MongoDB + Mongoose, Express, Node.js
- React 18 + Vite, React Router, Axios
- JWT bearer authentication, bcrypt password hashing

## Requirements

Node.js 18+ and npm. A MongoDB database is required (local MongoDB or MongoDB Atlas). This repository does not include credentials.

## Local setup

1. Clone/unzip the project and open a terminal in the `TaskFlow` directory.
2. Install dependencies: `npm run install:all` (or `npm install`, then `npm install --prefix server` and `npm install --prefix client`).
3. Copy `server/.env.example` to `server/.env`; set `MONGO_URI` to your MongoDB connection string, choose a long random `JWT_SECRET`, set `CLIENT_URL=http://localhost:5173`, and optionally set `PORT=5000`.
4. Start both apps: `npm run dev`.
5. Visit http://localhost:5173, register an account, then create projects and tasks. The first account is not automatically seeded; registration creates a real account.

The API runs at http://localhost:5000/api. The Vite dev server proxies `/api` to it. For production builds, set `VITE_API_URL` to the backend origin (for example `https://your-api.onrender.com/api`).

## Seed / demo data

No demo user or shared password is hard-coded. Register the first account, then create a project and tasks in the UI. To add teammates, each person registers using their own email; they will be available in the assignment picker. This avoids committing credentials or creating insecure public demo accounts.

## API overview

All routes return JSON. Protected routes require `Authorization: Bearer <token>`.

- `POST /api/auth/register` `{name,email,password}`
- `POST /api/auth/login` `{email,password}`
- `GET /api/auth/me`
- `GET,POST /api/projects`; `GET,PUT,DELETE /api/projects/:id`
- `GET,POST /api/tasks`; `GET,PUT,DELETE /api/tasks/:id`
- `GET /api/users` returns registered users for assignment

Projects are visible to their owner and members. Only the owner can update or delete the project. Tasks are scoped to project membership. Progress is computed as completed tasks / total tasks, with zero tasks producing 0%.

## Deploy frontend to Vercel

1. Push this project to a Git provider. In Vercel choose **Add New > Project**, import the repository, and set the Root Directory to `client`.
2. Framework preset: Vite. Build command: `npm run build`; output directory: `dist`; install command: `npm install`.
3. Add environment variable `VITE_API_URL` with the full backend API base URL, such as `https://YOUR-BACKEND.onrender.com/api` (no trailing slash required). Redeploy after changes.
4. `client/vercel.json` rewrites application routes to `index.html` for React Router deep links.

## Deploy backend

### Recommended: Render

1. Create a Render **Web Service** from the same repository, Root Directory `server`, runtime Node.
2. Build command `npm install`; start command `npm start`.
3. Add `MONGO_URI` (Atlas connection string), `JWT_SECRET` (long random secret), `CLIENT_URL` (your exact Vercel origin, e.g. `https://taskflow-yourname.vercel.app`), and `NODE_ENV=production`. Render provides `PORT` automatically.
4. Deploy and verify `https://YOUR-BACKEND.onrender.com/api/health` returns `{ "status": "ok" }`.
5. Set Vercel's `VITE_API_URL=https://YOUR-BACKEND.onrender.com/api`, then redeploy the frontend.

### Vercel serverless backend alternative

You can host the API on Vercel as a separate project, with the frontend still deployed as described above. In Vercel choose **Add New > Project**, import the same repository, and set Root Directory to `server` (include files outside the root directory if Vercel prompts). Vercel detects `server/vercel.json` and the function entry at `api/index.js`. Set the install command to `npm install`; add `MONGO_URI`, `JWT_SECRET`, and `CLIENT_URL` in Project Settings > Environment Variables, where `CLIENT_URL` is the exact frontend Vercel origin. Deploy and test `/api/health`. Set the frontend project's `VITE_API_URL` to `https://YOUR-API-PROJECT.vercel.app/api`, then redeploy it. The Express app connects to MongoDB on API requests and caches the Mongoose connection between warm serverless invocations. Do not use `*` for production CORS.

## CORS and environment variables

The API allows the configured `CLIENT_URL` plus localhost development origins. For a separately deployed frontend, set `CLIENT_URL` to its exact origin, including `https://` and excluding a trailing path. Required server variables: `MONGO_URI`, `JWT_SECRET`; optional: `PORT`, `CLIENT_URL`, `NODE_ENV`. Client variable: `VITE_API_URL`. Never commit `.env` files or expose `JWT_SECRET` in the frontend.

## Security notes

Passwords are bcrypt-hashed; JWTs expire in 7 days. Auth endpoints validate inputs, API errors avoid leaking stack traces in production, and project/task operations require authentication and membership checks. For a public production launch, add rate limiting, email verification, password reset, stronger audit logging, and a managed secret rotation process.
