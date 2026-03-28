# backend-auth-task-manager

Scalable REST API with JWT authentication, role-based access, and task CRUD, with a minimal React frontend.

## Tech Stack

- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT, bcryptjs
- **Frontend**: React

## Live Demo

- **Frontend (Vercel)**: `https://your-frontend-domain.vercel.app`
- **Backend API (Render/Railway)**: `https://your-backend-domain.com/api/v1`

---

## Project Structure

```
backend-auth-task-manager/
├── backend/
│   ├── config/        # Database connection
│   ├── controllers/   # Route handlers
│   ├── middleware/    # JWT auth & role-based access
│   ├── models/        # Mongoose models (User, Task)
│   ├── routes/        # Express routers
│   ├── .env.example   # Example environment file
│   ├── package.json
│   └── server.js      # Entry point
└── frontend/
    ├── public/
    └── src/
        ├── components/ # Login, Dashboard
        ├── App.js
        └── index.js
```

---

## Backend Setup

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` with your values:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/task-manager
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

### 3. Run the server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The backend runs on `http://localhost:5000`.

---

## Backend API Reference

All routes are prefixed with `/api/v1/`.

### Auth

| Method | Endpoint              | Access  | Description         |
|--------|-----------------------|---------|---------------------|
| POST   | `/auth/register`      | Public  | Register a new user |
| POST   | `/auth/login`         | Public  | Login & get token   |
| GET    | `/auth/me`            | Private | Get current user    |

### Tasks

| Method | Endpoint        | Access  | Description             |
|--------|-----------------|---------|-------------------------|
| GET    | `/tasks`        | Private | Get all tasks (own)     |
| POST   | `/tasks`        | Private | Create a new task       |
| GET    | `/tasks/:id`    | Private | Get a single task       |
| PUT    | `/tasks/:id`    | Private | Update a task           |
| DELETE | `/tasks/:id`    | Private | Delete a task           |

> **Admin users** can view and manage all tasks. **Regular users** can only access their own tasks.

---

## Frontend Setup

### 1. Install dependencies

```bash
cd frontend
npm install
```

### 2. Configure API URL

Create a `.env` file in `frontend/`:

```
REACT_APP_API_URL=http://localhost:5000/api/v1
```

### 3. Run the app

```bash
npm start
```

The frontend runs on `http://localhost:3000`.

---

## Deployment (Optional)

### Deploy Backend on Render

1. Push this repository to GitHub.
2. In Render, create a **Web Service** and connect your repo.
3. Set:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add environment variables in Render:
   - `PORT` = `10000` (or leave default if Render injects it)
   - `MONGO_URI` = your MongoDB Atlas connection string
   - `JWT_SECRET` = a long random secret
   - `JWT_EXPIRES_IN` = `7d`
   - `CORS_ORIGIN` = your deployed frontend URL (for example `https://your-frontend-domain.vercel.app`)
5. Deploy and note your backend URL.

### Deploy Backend on Railway

1. Create a new project from your GitHub repo.
2. Set service root to `backend`.
3. Railway will run `npm install`/`npm start` from `backend`.
4. Add environment variables:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN`
   - `CORS_ORIGIN` (set to frontend domain)
5. Deploy and copy the generated backend URL.

### Deploy Frontend on Vercel

1. Import the repo in Vercel.
2. Set **Root Directory** to `frontend`.
3. Add environment variable:
   - `REACT_APP_API_URL` = `https://your-backend-domain.com/api/v1`
4. Deploy and copy the frontend URL.
5. Update backend `CORS_ORIGIN` to this frontend URL if needed.

### Production Notes

- Do **not** commit `.env` files. This project only tracks `.env.example` templates.
- Keep secrets (`JWT_SECRET`, `MONGO_URI`) in hosting platform environment settings.
- Authentication, JWT, RBAC, and rate limiting remain unchanged and active in production.

---

## Features

- User registration and login with password hashing (bcrypt)
- JWT-based authentication stored in `localStorage`
- Role-based access control (user vs admin)
- Protected dashboard that fetches and displays user tasks
- Create and delete tasks via the UI
- Success/error feedback messages
- CORS enabled for frontend–backend communication

---

## License

MIT © 2026 Akshat Nayal
