# backend-auth-task-manager

Scalable REST API with JWT authentication, role-based access, and task CRUD, with a minimal React frontend.

## Tech Stack

- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT, bcryptjs
- **Frontend**: React

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

### 2. Configure API URL (optional)

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
