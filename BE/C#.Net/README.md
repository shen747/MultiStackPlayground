# UserManagement Backend API

A .NET 8 Web API project for user management functionality, built with Entity Framework Core and SQL Server.

## Project Overview

This backend API provides user management capabilities including user registration, authentication, and CRUD operations. The project follows clean architecture principles with a repository pattern for data access.

### Key Features
- User registration and authentication
- RESTful API endpoints
- Entity Framework Core with SQL Server
- Repository pattern for data access
- Clean architecture structure

### Project Structure
```
BE/
├── UserManagement.API/
│   ├── Data/                 # Data access layer
│   │   ├── AppDbContext.cs   # Entity Framework DbContext
│   │   └── Repository.cs     # Generic repository implementation
│   ├── Domain/               # Domain entities
│   ├── Features/             # Feature-based organization
│   ├── Services/             # Business logic services
│   └── Program.cs            # Application entry point
└── UserManagement.sln        # Solution file
```

## Prerequisites

- .NET 8 SDK
- SQL Server (LocalDB, Express, or full version)
- Entity Framework Core tools

### Install EF Core Tools
```bash
dotnet tool install --global dotnet-ef
```

## Database Setup

### 1. SQL Server Management Studio (SSMS) Setup

1. Install SQL Server Management Studio (SSMS) from Microsoft
2. Connect to your SQL Server instance

### 2. Create Database and User in SSMS

Open SQL Server Management Studio (SSMS), connect to your SQL Server instance, and execute the following SQL commands:

```sql
-- Create the database
CREATE DATABASE UserManagementDB;

-- Create a login for the application
CREATE LOGIN usermgmt_user WITH PASSWORD = 'YourSecurePassword123!';

-- Switch to the UserManagementDB database
USE UserManagementDB;

-- Create a user in the database for the login
CREATE USER usermgmt_user FOR LOGIN usermgmt_user;

-- Grant necessary permissions
ALTER ROLE db_datareader ADD MEMBER usermgmt_user;
ALTER ROLE db_datawriter ADD MEMBER usermgmt_user;
ALTER ROLE db_ddladmin ADD MEMBER usermgmt_user;
```

### 3. Update Connection String

After creating the database and user in SSMS, update the connection string in `appsettings.json` and `appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=.\\SQLEXPRESS;Database=UserManagementDB;User Id=usermgmt_user;Password=YourSecurePassword123!;TrustServerCertificate=true;MultipleActiveResultSets=true"
  }
}
```

**Note**: Replace the server name, user ID, and password with the values you configured in SSMS.

## Entity Framework Migrations

### Running Migrations

From the `BE\C#.Net` directory, run the following commands:

```bash
# Add initial migration
dotnet-ef migrations add InitialCreate --project UserManagement.API\UserManagement.API.csproj

# Update database with migrations
dotnet-ef database update --project UserManagement.API\UserManagement.API.csproj

# Add new migration (when you make model changes)
dotnet-ef migrations add MigrationName --project UserManagement.API\UserManagement.API.csproj
```

### Common EF Commands

```bash
# List all migrations
dotnet-ef migrations list --project UserManagement.API\UserManagement.API.csproj

# Remove last migration (if not applied to database)
dotnet-ef migrations remove --project UserManagement.API\UserManagement.API.csproj

# Update to specific migration
dotnet-ef database update MigrationName --project UserManagement.API\UserManagement.API.csproj

# Generate SQL script for migrations
dotnet-ef migrations script --project UserManagement.API\UserManagement.API.csproj
```

## Running the Application

### Development
```bash
# From the BE directory
cd UserManagement.API
dotnet run
```

### Production
```bash
# Build the application
dotnet build --configuration Release

# Run the application
dotnet run --configuration Release
```

The API will be available at:
- HTTP: `http://localhost:5000`
- HTTPS: `https://localhost:5001`

## API Documentation

When running in development mode, Swagger UI is available at:
- `https://localhost:5001/swagger`

## Troubleshooting

### Common Issues

1. **"No project was found" error with EF commands**
   - Ensure you're in the `BE` directory
   - Use the `--project` option with the correct path

2. **Database connection issues**
   - Verify SQL Server is running
   - Check connection string format
   - Ensure database and user exist

3. **Migration errors**
   - Check that DbContext is properly configured
   - Ensure all entity configurations are correct
   - Verify EF Core tools are installed

### Useful Commands

```bash
# Check EF tools version
dotnet-ef --version

# Get help for EF commands
dotnet-ef --help
dotnet-ef migrations --help
dotnet-ef database --help
```