# Reporting Module

This module provides comprehensive reporting and analytics functionality for the user management system. It supports various report types, formats, and includes both traditional service-based and CQRS implementations.

## Features

- **Multiple Report Types**: User analytics, registration reports, activity reports, and system metrics
- **Multiple Formats**: JSON, CSV, PDF, and Excel support
- **Report Management**: Create, update, delete, and track report status
- **File Generation**: Automatic file generation and download capabilities
- **CQRS Support**: Command Query Responsibility Segregation pattern implementation
- **Authentication**: JWT-based authentication for all endpoints
- **Filtering & Pagination**: Advanced filtering and pagination for report listings

## Report Types

### 1. User Analytics (`user_analytics`)

- Total user count and statistics
- Active vs inactive user breakdown
- Registration trends over time
- User engagement metrics

### 2. User Registration (`user_registration`)

- List of user registrations
- Registration details and timestamps
- Filterable by date range
- Export capabilities

### 3. User Activity (`user_activity`)

- User activity and engagement data
- Active user sessions
- Login patterns and frequency

### 4. System Metrics (`system_metrics`)

- System performance metrics
- Report generation statistics
- Database usage statistics
- Overall system health

### 5. Custom (`custom`)

- Custom report configurations
- Flexible parameter support
- Extensible for future report types

## Report Formats

- **JSON**: Structured data format for API consumption
- **CSV**: Comma-separated values for spreadsheet applications
- **PDF**: Portable Document Format for printing and sharing
- **Excel**: Microsoft Excel format for advanced analysis

## Report Status

- **PENDING**: Report creation requested, waiting to be processed
- **GENERATING**: Report is currently being generated
- **COMPLETED**: Report generation completed successfully
- **FAILED**: Report generation failed due to an error

## API Endpoints

### Traditional Service-based Endpoints (`/reports`)

#### Report Management

- `POST /reports` - Create a new report
- `GET /reports` - Get all reports with filtering and pagination
- `GET /reports/stats` - Get reporting statistics
- `GET /reports/:id` - Get a specific report
- `PATCH /reports/:id` - Update a report
- `DELETE /reports/:id` - Delete a report

#### Report Generation

- `POST /reports/generate` - Generate a new report
- `GET /reports/:id/download` - Download a generated report file

#### Predefined Reports

- `POST /reports/user-analytics` - Generate user analytics report
- `POST /reports/user-registration` - Generate user registration report
- `POST /reports/user-activity` - Generate user activity report
- `POST /reports/system-metrics` - Generate system metrics report

### CQRS-based Endpoints (`/reports-cqrs`)

All the same endpoints as above, but using CQRS pattern with CommandBus and QueryBus.

## Request/Response Examples

### Create Report

```bash
POST /reports
Content-Type: application/json
Authorization: Bearer <jwt-token>

{
  "name": "Monthly User Report",
  "description": "Monthly user analytics and statistics",
  "type": "user_analytics",
  "format": "json",
  "parameters": {
    "startDate": "2024-01-01",
    "endDate": "2024-01-31"
  }
}
```

### Generate User Analytics Report

```bash
POST /reports/user-analytics
Content-Type: application/json
Authorization: Bearer <jwt-token>

{
  "startDate": "2024-01-01",
  "endDate": "2024-01-31"
}
```

### Get Reports with Filtering

```bash
GET /reports?page=1&limit=10&type=user_analytics&status=completed&search=monthly
Authorization: Bearer <jwt-token>
```

### Download Report

```bash
GET /reports/{report-id}/download
Authorization: Bearer <jwt-token>
```

## Query Parameters

### Report Filtering (`/reports`)

- `page` - Page number (default: 1)
- `limit` - Number of items per page (default: 10, max: 100)
- `type` - Filter by report type
- `status` - Filter by report status
- `format` - Filter by report format
- `search` - Search in report name and description
- `startDate` - Filter reports created after this date
- `endDate` - Filter reports created before this date

## Response Examples

### Report List Response

```json
{
  "reports": [
    {
      "id": "uuid",
      "name": "Monthly User Report",
      "description": "Monthly user analytics",
      "type": "user_analytics",
      "status": "completed",
      "format": "json",
      "createdAt": "2024-01-15T10:30:00Z",
      "generatedAt": "2024-01-15T10:35:00Z",
      "createdBy": {
        "id": "user-uuid",
        "email": "admin@example.com",
        "firstName": "Admin",
        "lastName": "User"
      }
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

### User Analytics Report Data

```json
{
  "summary": {
    "totalUsers": 150,
    "activeUsers": 120,
    "inactiveUsers": 30,
    "activePercentage": 80
  },
  "registrationTrends": [
    {
      "month": "2024-01-01T00:00:00Z",
      "count": "25"
    }
  ],
  "generatedAt": "2024-01-15T10:35:00Z"
}
```

## File Storage

Generated report files are stored in the `uploads/reports/` directory with the following naming convention:

- Format: `{report-id}-{timestamp}.{format}`
- Example: `abc123-1642248600000.csv`

## Security

- All endpoints require JWT authentication
- Users can only access their own reports (unless admin)
- File downloads are validated for existence and permissions
- Report data is sanitized before storage

## Error Handling

The module includes comprehensive error handling:

- `NotFoundException` - When report or file is not found
- `BadRequestException` - When report is not ready for download
- `InternalServerErrorException` - When file generation fails
- `ConflictException` - When report with same name exists

## Future Enhancements

- **Scheduled Reports**: Automatic report generation on schedule
- **Email Delivery**: Send reports via email
- **Advanced Analytics**: More sophisticated analytics and visualizations
- **Report Templates**: Predefined report templates
- **Data Export**: Export to additional formats (XML, YAML)
- **Report Sharing**: Share reports with other users
- **Audit Trail**: Track report access and modifications
