# User Management API

A comprehensive NestJS-based user management system with reporting capabilities. This project provides a complete REST API for user authentication, management, and analytics with support for both traditional service-based and CQRS (Command Query Responsibility Segregation) patterns.

## Features

- **User Management**: Complete CRUD operations for users with JWT authentication
- **Reporting System**: Generate various types of reports (user analytics, registration, activity, system metrics)
- **CQRS Support**: Both traditional and CQRS implementations for scalable architecture
- **Database Support**: TypeORM with SQL Server integration
- **Security**: JWT-based authentication with bcrypt password hashing
- **File Generation**: Export reports in multiple formats (JSON, CSV, PDF, Excel)

## Tech Stack

- **Framework**: NestJS
- **Database**: SQL Server with TypeORM
- **Authentication**: JWT with Passport
- **Validation**: class-validator
- **Architecture**: CQRS pattern support

## Prerequisites

- Node.js (v16 or higher)
- SQL Server (local or remote instance)
- npm or yarn

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd user-management-api
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:

   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=1433
   DB_USERNAME=ramesh
   DB_PASSWORD=YourStrongPassword123!
   DB_DATABASE=user_management

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-here

   # Application Configuration
   NODE_ENV=development
   PORT=3000
   ```

4. **Set up SQL Server**
   - Ensure SQL Server is running
   - Create the database: `user_management`
   - Create user `ramesh` with appropriate permissions
   - Enable TCP/IP protocol in SQL Server Configuration Manager

## Database Setup

### Option 1: Automatic Table Creation (Development)

The application will automatically create tables when you start it:

```bash
npm run start:dev
```

### Option 2: Using Migrations (Production)

1. **Generate initial migration**

   ```bash
   npm run migration:generate src/migrations/InitialCreate
   ```

2. **Run migrations**

   ```bash
   npm run migration:run
   ```

3. **Revert last migration (if needed)**
   ```bash
   npm run migration:revert
   ```

## Available Scripts

- `npm run start:dev` - Start development server with hot reload
- `npm run build` - Build the application
- `npm run start:prod` - Start production server
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## API Endpoints

### Users Module (`/users`)

- `POST /users/register` - Register new user
- `POST /users/login` - User login
- `GET /users/profile` - Get current user profile
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Users CQRS Module (`/users-cqrs`)

Same endpoints as above but using CQRS pattern.

### Reporting Module (`/reports`)

- `POST /reports` - Create new report
- `GET /reports` - Get all reports with filtering
- `GET /reports/stats` - Get reporting statistics
- `GET /reports/:id` - Get specific report
- `PATCH /reports/:id` - Update report
- `DELETE /reports/:id` - Delete report
- `POST /reports/generate` - Generate new report
- `GET /reports/:id/download` - Download report file

### Predefined Reports

- `POST /reports/user-analytics` - Generate user analytics report
- `POST /reports/user-registration` - Generate user registration report
- `POST /reports/user-activity` - Generate user activity report
- `POST /reports/system-metrics` - Generate system metrics report

### Reporting CQRS Module (`/reports-cqrs`)

Same endpoints as above but using CQRS pattern.

## Project Structure

```
src/
├── users/                 # User management module
│   ├── commands/         # CQRS commands
│   ├── queries/          # CQRS queries
│   ├── dto/              # Data transfer objects
│   ├── entities/         # TypeORM entities
│   ├── guards/           # Authentication guards
│   ├── strategies/       # Passport strategies
│   └── decorators/       # Custom decorators
├── reporting/            # Reporting module
│   ├── commands/         # CQRS commands
│   ├── queries/          # CQRS queries
│   ├── dto/              # Data transfer objects
│   ├── entities/         # TypeORM entities
│   └── controllers/      # REST controllers
├── database/             # Database configuration
│   └── data-source.ts    # TypeORM data source
└── app.module.ts         # Main application module
```

## Development

1. **Start the development server**

   ```bash
   npm run start:dev
   ```

2. **The API will be available at**

   ```
   http://localhost:3000
   ```

3. **Test the API**

   ```bash
   # Register a new user
   curl -X POST http://localhost:3000/users/register \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "password": "password123",
       "firstName": "John",
       "lastName": "Doe"
     }'

   # Login
   curl -X POST http://localhost:3000/users/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "password": "password123"
     }'
   ```

## Troubleshooting

### SQL Server Connection Issues

1. Ensure SQL Server service is running
2. Enable TCP/IP protocol in SQL Server Configuration Manager
3. Check firewall settings
4. Verify database credentials

### Migration Issues

1. Ensure database connection is working
2. Check if database exists
3. Verify user permissions
4. Use `synchronize: true` for development if migrations fail

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the UNLICENSED license.
