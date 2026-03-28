# backend-auth-task-manager

Scalable REST API with authentication and role-based access, plus a simple React frontend for testing APIs.

## About the Assignment

This project is built for the Backend Developer Intern assignment.

Goal:
1. Build a secure and scalable backend API with authentication and RBAC.
2. Build a basic frontend UI to demonstrate API usage.

## Assignment Coverage

### Backend (Primary Focus)

1. User registration and login with bcrypt password hashing and JWT authentication.
2. Role-based access (user vs admin).
3. CRUD APIs for a secondary entity (tasks).
4. API versioning with `/api/v1`, centralized error responses, and request validation.
5. API documentation via Swagger (`/api/v1/docs`).
6. Database schema and data model using MongoDB + Mongoose.

### Basic Frontend (Supportive)

1. Built with React.
2. UI supports:
   - Register and login.
   - Protected dashboard access with JWT.
   - Task CRUD operations.
   - Success and error messages.
3. Admin users can manage roles directly from dashboard UI.

### Security and Scalability

1. JWT authentication with protected routes.
2. Password hashing using bcryptjs.
3. Input validation using express-validator.
4. Rate limiting on auth and task routes.
5. Modular structure for easy feature expansion.

## Tech Stack

1. Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, express-validator.
2. Frontend: React.

## Project Structure

```text
backend-auth-task-manager/
|-- backend/
|   |-- config/
|   |-- controllers/
|   |-- middleware/
|   |-- models/
|   |-- routes/
|   |-- scripts/
|   |-- .env.example
|   |-- package.json
|   `-- server.js
`-- frontend/
    |-- public/
    |-- src/
    |-- .env.example
    `-- package.json
```

## Local Setup

### 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Set values in backend `.env`:

```dotenv
PORT=5000
MONGO_URI=mongodb://localhost:27017/task-manager
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRES_IN=7d
ADMIN_INVITE_CODE=fromProgrammer
CORS_ORIGIN=http://localhost:3000
```

Run backend:

```bash
npm run dev
```

### 2. Frontend setup

```bash
cd ../frontend
npm install
cp .env.example .env
```

Set value in frontend `.env`:

```dotenv
REACT_APP_API_URL=http://localhost:5000/api/v1
```

Run frontend:

```bash
npm start
```

## Role-Based Access: Easy Admin Setup

### Option 1 (Simple UI flow with code)

1. Keep `ADMIN_INVITE_CODE=fromProgrammer` in backend env.
2. Open register screen in frontend.
3. Click `Have Admin Code?`.
4. Enter `fromProgrammer` and register.
5. That user is created as `admin`.

### Option 2 (One-time script)

Register normal user first, then run:

```bash
cd backend
npm run make-admin -- your-email@example.com
```

## API Reference

Base URL: `/api/v1`

### Auth APIs

1. `POST /auth/register` (Public)
2. `POST /auth/login` (Public)
3. `GET /auth/me` (Private)
4. `GET /auth/admin/users` (Admin)
5. `PATCH /auth/admin/users/:id/role` (Admin)

### Task APIs

1. `GET /tasks` (Private)
2. `POST /tasks` (Private)
3. `GET /tasks/:id` (Private)
4. `PUT /tasks/:id` (Private)
5. `DELETE /tasks/:id` (Private)

Swagger Docs:

`/api/v1/docs`

## Deployment Steps

### Backend on Render

1. Create Web Service from GitHub repo.
2. Set Root Directory: `backend`.
3. Build Command: `npm install`.
4. Start Command: `npm start`.
5. Set env variables on Render:
   - `MONGO_URI=<atlas-uri>`
   - `JWT_SECRET=<strong-secret>`
   - `JWT_EXPIRES_IN=7d`
   - `ADMIN_INVITE_CODE=fromProgrammer`
   - `CORS_ORIGIN=<your-vercel-frontend-domain>`

### Frontend on Vercel

1. Import same repo in Vercel.
2. Root Directory: `frontend`.
3. Build Command: `npm run build`.
4. Output Directory: `build`.
5. Env variable:
   - `REACT_APP_API_URL=https://your-render-domain.onrender.com/api/v1`

## Deliverables Checklist

1. Backend hosted on GitHub with setup README.
2. Working authentication and task CRUD APIs.
3. Basic frontend integrated with backend APIs.
4. API documentation through Swagger.

## Short Scalability Note

Current structure is modular and can scale by splitting domains into services:

1. Move auth, users, and tasks into separate services when traffic grows.
2. Add Redis caching for hot read endpoints.
3. Use load balancing and horizontal scaling for API servers.
4. Add centralized logging and monitoring for production observability.

## License

MIT © 2026 Akshat Nayal
