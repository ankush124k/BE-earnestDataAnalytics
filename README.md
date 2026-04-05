# Task Management System - Backend

A Node.js backend API for task management with authentication, built using Express.js, Prisma ORM, and PostgreSQL.

## Features

- **Authentication**: JWT-based auth with access and refresh tokens
- **Task Management**: Full CRUD operations for tasks with user isolation
- **Search & Filter**: Search by title (case-insensitive), filter by status, pagination
- **Security**: Password hashing with bcrypt, JWT tokens, CORS protection
- **MVC Architecture**: Clean separation of concerns with controllers, routes, and middleware

## Tech Stack

- **Runtime**: Node.js (CommonJS)
- **Framework**: Express.js
- **Database**: PostgreSQL (Prisma Cloud)
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Validation**: Built-in Express validation

## Project Structure (MVC Architecture)

```
backend/
├── index.js                    # Entry point - Express setup & routing
├── config/
│   └── database.js             # Prisma database connection
├── controllers/
│   ├── authController.js       # Auth logic: register, login, refresh, logout
│   └── taskController.js       # Task logic: CRUD & toggle operations
├── middleware/
│   ├── auth.js                 # JWT verification & authentication
│   └── errorHandler.js         # Global error handling
├── routes/
│   ├── authRoutes.js           # Auth endpoints
│   └── taskRoutes.js           # Task endpoints
├── utils/
│   └── tokenUtils.js           # Token creation & cookie utilities
├── prisma/
│   └── schema.prisma           # Database schema
├── .env                        # Environment variables
├── .env.example                # Environment template
├── package.json                # Dependencies & scripts
└── .gitignore                  # Git ignore rules
```

## Prerequisites

- Node.js (v16 or higher)
- npm
- PostgreSQL database (Prisma Cloud setup included)

## Installation & Setup

### 1. Clone & Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

Copy the `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

**Required Environment Variables:**

```env
# Database
DATABASE_URL=postgres://dea9664682cff40dea2d337f22bf9a743353d981406dcef7b8c33066d851f96b:sk_sWjAsGJDdoimGFlghWPLa@db.prisma.io:5432/postgres?sslmode=require

# JWT Secrets (Keep these secure!)
JWT_ACCESS_SECRET=4268f621491a66f74ef5bd9fe35b9bccbce6074bbe6827d6582b36d3f88a13ad
JWT_REFRESH_SECRET=4b9986cfd5dd23901e8bcf33c9aeb77bb68bc58d23aef6a79a651a881d739181

# Token Expiry
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# Server Configuration
PORT=5000
CORS_ORIGIN=http://localhost:3000
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push
```

### 4. Start Development Server

```bash
npm run dev
```

The backend will start on `http://localhost:5000`

## API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | ❌ |
| POST | `/auth/login` | User login | ❌ |
| POST | `/auth/refresh` | Refresh access token | ❌ (uses refresh cookie) |
| POST | `/auth/logout` | User logout | ✅ |

### Task Management Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/tasks` | Get user's tasks (with pagination, search, filter) | ✅ |
| POST | `/tasks` | Create new task | ✅ |
| PATCH | `/tasks/:id` | Update task | ✅ |
| DELETE | `/tasks/:id` | Delete task | ✅ |
| POST | `/tasks/:id/toggle` | Toggle task status | ✅ |

### Query Parameters (GET /tasks)

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)
- `status`: Filter by status (`true` for complete, `false` for incomplete)
- `search`: Search in task titles (case-insensitive)

Example: `GET /tasks?page=1&limit=10&status=false&search=urgent`

## Request/Response Examples

### Register User
```bash
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

### Create Task
```bash
POST /tasks
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the task management system"
}
```

### Get Tasks with Search
```bash
GET /tasks?page=1&limit=10&search=project&status=false
Authorization: Bearer YOUR_JWT_TOKEN
```

## Security Features

- **Password Hashing**: bcrypt with salt rounds of 10
- **JWT Tokens**: Short-lived access tokens (15min) + long-lived refresh tokens (7 days)
- **HTTP-Only Cookies**: Refresh tokens stored securely in httpOnly cookies
- **User Isolation**: Tasks are strictly scoped to authenticated users
- **Input Validation**: Basic validation for required fields
- **CORS Protection**: Configured for frontend origin

## Development

### Available Scripts

```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
```

### Database Commands

```bash
npx prisma studio          # Open Prisma Studio (database GUI)
npx prisma db push         # Push schema changes to database
npx prisma generate        # Regenerate Prisma client
npx prisma migrate dev     # Create and apply migrations (if needed)
```

### Testing the API

You can test the API using tools like:
- **Postman**: Import the endpoints and test manually
- **curl**: Command line testing
- **Thunder Client**: VS Code extension

Example curl command:
```bash
curl -X GET "http://localhost:5000/tasks?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Error Handling

The API returns standard HTTP status codes:
- `200`: Success
- `201`: Created
- `204`: No Content (for DELETE)
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (invalid/missing tokens)
- `404`: Not Found
- `500`: Internal Server Error

All errors return JSON format:
```json
{
  "message": "Error description"
}
```

## Logging

The server logs all API requests with timestamps:
```
📡 GET /tasks - 2024-01-15T10:30:00.000Z
📡 POST /auth/login - 2024-01-15T10:30:05.000Z
```

## Deployment

For production deployment:

1. Set `NODE_ENV=production`
2. Update `CORS_ORIGIN` to your frontend domain
3. Use environment-specific JWT secrets
4. Configure proper SSL/HTTPS
5. Set up process manager (PM2, Docker, etc.)

## Contributing

1. Follow MVC architecture patterns
2. Add proper error handling
3. Include JSDoc comments for complex functions
4. Test API endpoints thoroughly
5. Update this README for any new features

## License

This project is part of an assignment submission.