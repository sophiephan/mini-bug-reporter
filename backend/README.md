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