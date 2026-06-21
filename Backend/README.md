# TaskFlow Backend

A RESTful API backend for the TaskFlow Task Management Application built using Node.js, Express.js, and MongoDB Atlas.

## Features

- User Authentication
- JWT Authorization
- Password Hashing
- User Profile Management
- Task CRUD Operations
- Dashboard Statistics
- Search & Filter Tasks
- MongoDB Atlas Integration
- Error Handling Middleware
- Secure API Endpoints

## Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT
- bcryptjs
- Express Validator
- Morgan
- Dotenv

## Project Structure

backend/
├── config/
├── middleware/
├── models/
├── routes/
├── server.js
├── package.json
└── .env

## Installation

1. Navigate to backend directory

```bash
cd backend
```

2. Install dependencies

```bash
npm install
```

3. Configure environment variables

Create a `.env` file:

```env
PORT=5000
NODE_ENV=development

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key
JWT_EXPIRE=7d

CLIENT_URL=http://localhost:5173
```

4. Start server

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

## API Endpoints

### Authentication

```http
POST /api/auth/register
```

Register a new user.

```http
POST /api/auth/login
```

Login user.

```http
GET /api/auth/profile
```

Get logged-in user profile.

```http
PUT /api/auth/profile
```

Update profile.

### Tasks

```http
GET /api/tasks
```

Get all tasks.

```http
GET /api/tasks/:id
```

Get task by ID.

```http
POST /api/tasks
```

Create task.

```http
PUT /api/tasks/:id
```

Update task.

```http
DELETE /api/tasks/:id
```

Delete task.

### Dashboard

```http
GET /api/tasks/stats
```

Get task statistics.

## Database

MongoDB Atlas Collections:

### Users

Stores:

- Name
- Email
- Password (Hashed)

### Tasks

Stores:

- Title
- Description
- Status
- Priority
- User Reference
- Timestamps

## Security

- JWT Authentication
- Password Hashing (bcrypt)
- Protected Routes
- Environment Variables
- Input Validation

## Author

Developed as part of Full Stack Development Internship Project.
