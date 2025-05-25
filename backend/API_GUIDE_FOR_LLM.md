# Bug Reporter API Guide for LLM

This document provides a comprehensive overview of the Bug Reporter API for LLM (Large Language Model) consumption.

## Core Components

### Bug Entity

The central data model representing a bug report:

```java
public class Bug {
    private Long id;                    // Unique identifier
    private String title;               // Bug title (required)
    private String description;         // Bug description (optional)
    private String screenshotUrl;       // URL to screenshot (optional)
    private LocalDateTime createdAt;    // Timestamp when bug was created
    private Status status;              // Current status (OPEN, IN_PROGRESS, CLOSED)
    
    public enum Status {
        OPEN, IN_PROGRESS, CLOSED
    }
    
    // Constructors, getters, and setters are available
}
```

### BugRepository

Interface for database operations:

```java
public interface BugRepository extends JpaRepository<Bug, Long> {
    List<Bug> findByStatusOrderByCreatedAtDesc(Bug.Status status);
    List<Bug> findAllByOrderByCreatedAtDesc();
}
```

### BugController

REST controller exposing the API endpoints:

```java
@RestController
@RequestMapping("/api/bugs")
@CrossOrigin(origins = "http://localhost:5173") // Allow React dev server
public class BugController {
    // Endpoints and methods are defined here
}
```

## API Endpoints

### GET /api/bugs

Retrieves all bugs, sorted by creation date (newest first).

**Response:** Array of Bug objects

**Example:**
```json
[
  {
    "id": 1,
    "title": "Login button not working",
    "description": "When clicking the login button, nothing happens",
    "screenshotUrl": "http://example.com/screenshot1.png",
    "createdAt": "2023-06-15T14:30:45.123",
    "status": "OPEN"
  },
  {
    "id": 2,
    "title": "Incorrect calculation in report",
    "description": "The total sum is wrong in the monthly report",
    "screenshotUrl": null,
    "createdAt": "2023-06-14T09:15:22.456",
    "status": "IN_PROGRESS"
  }
]
```

### GET /api/bugs/{id}

Retrieves a specific bug by ID.

**Parameters:**
- `id`: Long - The bug ID

**Response:** Bug object or 404 Not Found

**Example:**
```json
{
  "id": 1,
  "title": "Login button not working",
  "description": "When clicking the login button, nothing happens",
  "screenshotUrl": "http://example.com/screenshot1.png",
  "createdAt": "2023-06-15T14:30:45.123",
  "status": "OPEN"
}
```

### POST /api/bugs

Creates a new bug report.

**Request Body:**
```json
{
  "title": "New bug title",
  "description": "Detailed description of the bug",
  "screenshotUrl": "http://example.com/screenshot.png"
}
```

**Response:** The created Bug object

### PUT /api/bugs/{id}/status

Updates the status of an existing bug.

**Parameters:**
- `id`: Long - The bug ID

**Request Body:**
```json
{
  "status": "IN_PROGRESS"  // Must be one of: "OPEN", "IN_PROGRESS", "CLOSED"
}
```

**Response:** The updated Bug object or 404 Not Found

### DELETE /api/bugs/{id}

Deletes a bug report.

**Parameters:**
- `id`: Long - The bug ID

**Response:** 
- 200 OK if successful
- 404 Not Found if the bug doesn't exist

## Error Handling

The API returns appropriate HTTP status codes:
- 200 OK: Successful operation
- 404 Not Found: Resource not found
- 400 Bad Request: Invalid input (e.g., malformed request body)
- 500 Internal Server Error: Unexpected server error

## Database

The application uses an H2 in-memory database by default, which is reset on application restart.

## CORS Configuration

The API allows cross-origin requests from specified origins configured in the application properties. By default, it allows requests from `http://localhost:5173`, which is the default port for the React development server.

This configuration is managed in the `application-docker.properties` file (or other relevant properties files) and can be modified to allow requests from different origins as needed.

## Authentication

The current implementation does not include authentication. All endpoints are publicly accessible. 