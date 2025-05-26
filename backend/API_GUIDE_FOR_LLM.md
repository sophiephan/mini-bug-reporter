# Bug Reporter API Guide for LLMs

This document provides a comprehensive overview of the Bug Reporter API for language models to understand the system architecture, endpoints, and integration patterns.

## System Architecture

The Bug Reporter consists of:

1. **Backend API**: Spring Boot application providing RESTful endpoints
2. **Database**: PostgreSQL for data persistence
3. **Frontend Component**: React component that can be integrated into any application

## Core Entities

### Bug

The main entity representing a bug report:

```java
public class Bug {
    @Id @GeneratedValue
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(length = 1000)
    private String description;
    
    private String screenshotUrl;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    @Enumerated(EnumType.STRING)
    private Status status = Status.OPEN;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority = Priority.MEDIUM;
    
    // Custom metadata for flexible context data
    @ElementCollection
    @CollectionTable(name = "bug_metadata", 
                    joinColumns = @JoinColumn(name = "bug_id"))
    @MapKeyColumn(name = "metadata_key")
    @Column(name = "metadata_value")
    private Map<String, String> metadata = new HashMap<>();
    
    // Enums, constructors, getters and setters...
}
```

## API Endpoints

### Get All Bugs
```
GET /api/bugs
```
Returns all bugs sorted by creation date (newest first).

### Get Bug by ID
```
GET /api/bugs/{id}
```
Returns a specific bug by ID.

### Create Bug
```
POST /api/bugs
```
Creates a new bug report.

Request body:
```json
{
  "title": "Button not working",
  "description": "The submit button doesn't respond when clicked",
  "screenshotUrl": "https://example.com/screenshot.png",
  "priority": "HIGH",
  "metadata": {
    "reportedBy": "user@example.com",
    "sourcePage": "/dashboard",
    "appVersion": "1.2.3"
  }
}
```

### Update Bug Status
```
PUT /api/bugs/{id}/status
```
Updates a bug's status.

Request body:
```json
{
  "status": "IN_PROGRESS"
}
```

### Update Bug Priority
```
PUT /api/bugs/{id}/priority
```
Updates a bug's priority.

Request body:
```json
{
  "priority": "CRITICAL"
}
```

### Update Bug Metadata
```
PUT /api/bugs/{id}/metadata
```
Updates or adds metadata to a bug.

Request body:
```json
{
  "assignedTo": "developer@example.com",
  "estimatedCompletion": "2023-12-31"
}
```

### Delete Bug
```
DELETE /api/bugs/{id}
```
Deletes a bug report.

## CORS Configuration

The system includes a smart CORS configuration that handles both development and production environments:

```java
@Configuration
public class WebConfig {
    
    @Value("${cors.allowed-origins:*}")
    private String allowedOrigins;
    
    @Value("${cors.allowed-methods:GET,POST,PUT,DELETE}")
    private String allowedMethods;
    
    @Value("${cors.max-age:3600}")
    private long maxAge;
    
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                if ("*".equals(allowedOrigins)) {
                    // When using wildcard origin, we cannot use allowCredentials(true)
                    registry.addMapping("/api/**")
                            .allowedOrigins(allowedOrigins)
                            .allowedMethods(allowedMethods.split(","))
                            .allowCredentials(false)
                            .maxAge(maxAge);
                } else {
                    // When using specific origins, we can use allowCredentials(true)
                    registry.addMapping("/api/**")
                            .allowedOrigins(allowedOrigins.split(","))
                            .allowedMethods(allowedMethods.split(","))
                            .allowCredentials(true)
                            .maxAge(maxAge);
                }
            }
        };
    }
}
```

This configuration:
- Automatically adapts based on the origin configuration
- Handles the browser security requirement that prohibits using wildcard origins with credentials
- Allows for flexible deployment in both development and production environments

## Integration Patterns

### Standalone Backend

Run the Bug Reporter as a separate service:

```bash
docker-compose -f docker-compose.standalone.yml up --build
```

This deploys:
- PostgreSQL database
- Bug Reporter backend API

The API will be available at `http://localhost:8080/api/bugs`.

### Frontend Component Integration

The frontend provides a React component that can be integrated into any application:

```tsx
import { BugReporter } from './components/BugReporter';

function App() {
  return (
    <div>
      <h1>My Application</h1>
      <BugReporter 
        options={{
          apiEndpoint: 'http://localhost:8080/api/bugs',
          showPriority: true,
          getContextData: () => ({
            reportedBy: 'user@example.com',
            sourcePage: window.location.pathname
          })
        }} 
      />
    </div>
  );
}
```

## Database Schema

The database uses the following schema:

```sql
CREATE TABLE bugs (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(1000),
    screenshot_url VARCHAR(255),
    created_at TIMESTAMP NOT NULL,
    status VARCHAR(20) CHECK (status IN ('OPEN', 'IN_PROGRESS', 'CLOSED')),
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'))
);

CREATE TABLE bug_metadata (
    bug_id BIGINT NOT NULL,
    metadata_key VARCHAR(255) NOT NULL,
    metadata_value VARCHAR(255),
    PRIMARY KEY (bug_id, metadata_key),
    FOREIGN KEY (bug_id) REFERENCES bugs(id)
);
```

## Common Integration Scenarios

1. **Independent Bug Tracking System**: Deploy the full stack as a standalone application
2. **Embedded in Existing App**: Use the frontend component with your existing backend
3. **API Integration**: Send bug reports from your custom UI to the Bug Reporter API
4. **Automated Bug Reporting**: Configure your error handling to automatically create bug reports

## Best Practices

1. **Production CORS Configuration**: Always use specific origins in production
2. **Metadata Usage**: Use metadata for flexible context data rather than modifying the core schema
3. **Authentication**: When deployed in production, secure the API with appropriate authentication
4. **Data Privacy**: Be mindful of what user data is included in bug reports 

## Working with Metadata

The Bug Reporter API supports flexible metadata for bug reports, which allows you to include any additional context data without modifying the core schema.

### Structure

Metadata is stored as key-value pairs associated with each bug:

```json
{
  "title": "Button not working",
  "description": "The submit button doesn't respond when clicked",
  "priority": "HIGH",
  "metadata": {
    "reportedBy": "user@example.com",
    "appVersion": "1.2.3",
    "browser": "Chrome 118.0.0.0",
    "os": "Windows 11",
    "customField": "Any string, number, boolean, or null value"
  }
}
```

### Metadata Value Types

The system supports the following types of metadata values:
- String
- Number
- Boolean
- Null

Complex objects and arrays are not directly supported in metadata values. If you need to store complex data, consider serializing it to a string (e.g., using JSON.stringify()).

### Adding Metadata via Frontend

The frontend component provides a convenient way to add metadata through the `getContextData` option:

```tsx
<BugReporter 
  options={{
    getContextData: () => {
      // This can be sync or async
      return {
        reportedBy: getCurrentUser().email,
        appVersion: APP_VERSION,
        currentRoute: window.location.pathname
      };
    }
  }} 
/>
```

This context data is automatically included as metadata with each bug report.

### Querying Bugs by Metadata

You can search for bugs with specific metadata values using the API:

```
GET /api/bugs?metadata.reportedBy=user@example.com
```

This will return all bugs where the metadata contains a "reportedBy" key with the value "user@example.com".

### Best Practices for Metadata

1. **Use consistent keys**: Establish naming conventions for metadata keys to ensure consistency
2. **Include valuable context**: Add metadata that helps with debugging and categorization
3. **Avoid sensitive data**: Don't include personal or sensitive data in metadata
4. **Keep values simple**: Prefer simple scalar values over complex structures
5. **Document metadata keys**: Maintain documentation of the metadata keys your application uses 