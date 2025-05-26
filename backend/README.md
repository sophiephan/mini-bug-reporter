# Bug Reporter Backend

This is the backend service for the Bug Reporter application, built with Spring Boot.

## Overview

The Bug Reporter backend provides a RESTful API for managing bug reports. It allows creating, retrieving, updating, and deleting bug reports.

## Tech Stack

- Java 17
- Spring Boot 3.2.0
- Spring Data JPA
- H2 Database (in-memory)
- Gradle for build management

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/bugs` | Get all bugs (sorted by creation date, newest first) |
| GET    | `/api/bugs/{id}` | Get a specific bug by ID |
| POST   | `/api/bugs` | Create a new bug report |
| PUT    | `/api/bugs/{id}/status` | Update a bug's status |
| DELETE | `/api/bugs/{id}` | Delete a bug report |

## Data Models

### Bug

The main entity representing a bug report with the following fields:

- `id`: Long - Unique identifier
- `title`: String - Bug title
- `description`: String - Detailed description of the bug
- `screenshotUrl`: String - URL to a screenshot (if available)
- `createdAt`: LocalDateTime - When the bug was reported
- `status`: Enum - Current status (OPEN, IN_PROGRESS, CLOSED)

## Request DTOs

### CreateBugRequest
- `title`: String - Required
- `description`: String - Optional
- `screenshotUrl`: String - Optional

### UpdateStatusRequest
- `status`: String - One of: "OPEN", "IN_PROGRESS", "CLOSED"

## Running the Application

1. Navigate to the backend directory
2. Run the application:
   ```
   ./gradlew bootRun
   ```
3. The API will be available at `http://localhost:8080`

## Development

The application uses an in-memory H2 database by default, which is reset on application restart.

## Testing

Run the tests with:
```
./gradlew test
```

## Docker

The backend can be containerized using Docker:

```
docker build -t bug-reporter-backend .
```

Run the container:

```
docker run -p 8080:8080 bug-reporter-backend
```

Or use Docker Compose from the root directory to run both frontend and backend:

```
docker-compose up --build
```

## Integrating with Your Existing Application

You can integrate the Bug Reporter backend with your existing application in several ways:

### Option 1: Standalone Deployment

Run the Bug Reporter backend as a separate service alongside your main application:

1. Deploy the Bug Reporter backend as a standalone service
2. Configure CORS in `application.properties` to allow requests from your main application:
   ```properties
   # CORS Configuration
   spring.web.cors.allowed-origins=https://your-main-app.com
   spring.web.cors.allowed-methods=GET,POST,PUT,DELETE
   spring.web.cors.allowed-headers=*
   ```
3. Point your frontend Bug Reporter component to this standalone API

**Benefits:**
- Separation of concerns
- Independent scaling
- Isolated database
- No code changes to your existing application

### CORS Configuration

The application includes a smart CORS configuration that handles both development and production environments:

- In development, you can use wildcard origins (`*`) for convenience
- In production, you should specify exact origins for security

The `WebConfig` class automatically adjusts the CORS settings based on the configuration:
- When using wildcard origins, credentials are disabled (required by browsers)
- When using specific origins, credentials are enabled for proper authentication

Example configuration in `application.properties`:
```properties
# Development (wildcard)
cors.allowed-origins=*

# Production (specific origins)
cors.allowed-origins=https://your-app.com,https://admin.your-app.com
cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
cors.max-age=3600
```

This approach ensures maximum flexibility while maintaining security best practices.

### Option 2: Embedded as a Module

Include the Bug Reporter as a module within your existing Spring Boot application:

1. Copy the following packages to your application:
   - `com.example.bugreporter.Bug`
   - `com.example.bugreporter.BugRepository`
   - `com.example.bugreporter.BugController`
   - `com.example.bugreporter.service.BugService`

2. Add the database migration scripts to your project:
   - `V1__Create_bugs_table.sql`
   - `V2__Add_priority_field.sql`
   - `V3__Add_metadata_table.sql`

3. Update package names as needed to match your application's structure

**Benefits:**
- Single deployment
- Shared authentication/authorization
- Access to your application's existing services and utilities

### Database Configuration

#### Standalone Deployment

For a production deployment, configure the database connection in `application.properties`:

```properties
# PostgreSQL Configuration
spring.datasource.url=jdbc:postgresql://your-db-host:5432/bugreporter
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=validate
```

#### Shared Database

If you want to use your existing application's database:

1. Configure the Bug Reporter to use the same database connection
2. Add the migration scripts to your application's migrations
3. Prefix table names if needed to avoid conflicts (e.g., `bug_reporter_bugs` instead of `bugs`)

### Custom Context Data

The Bug Reporter supports custom metadata for each bug report. This allows you to include additional context from your application:

```json
{
  "title": "Button not working",
  "description": "The submit button doesn't respond when clicked",
  "priority": "HIGH",
  "metadata": {
    "reportedBy": "user@example.com",
    "sourcePage": "/dashboard",
    "appVersion": "1.2.3",
    "userAgent": "Mozilla/5.0...",
    "customField": "Any additional context"
  }
}
```

You can query bugs with specific metadata using JPA or direct SQL queries.

## Security Considerations

When integrating with your existing application, consider these security aspects:

1. **Authentication**: Decide whether bug reporting should require authentication
2. **Authorization**: Control who can view/manage bug reports
3. **Rate Limiting**: Prevent abuse of the bug reporting API
4. **Data Privacy**: Be careful about what user data is included in bug reports 