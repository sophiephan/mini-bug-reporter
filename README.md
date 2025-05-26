# Mini Bug Reporter

A full-stack application for reporting and tracking bugs in software projects.

## Project Structure

- `/frontend` - React frontend application
- `/backend` - Spring Boot backend API
- `/backend/src/main/resources/db/migration` - Database migration scripts

## Features

- Create, view, and delete bug reports
- Track bug status (OPEN, IN_PROGRESS, CLOSED)
- Set bug priority (LOW, MEDIUM, HIGH, CRITICAL)
- Add screenshots via URL
- Responsive UI built with React and Tailwind CSS
- RESTful API with Spring Boot
- PostgreSQL database with Flyway migrations

## Backend

The backend is built with Spring Boot and provides a RESTful API for managing bug reports.

See [Backend README](./backend/README.md) for detailed information.

## Frontend

The frontend is built with React and provides a user interface for interacting with the bug reporting system.

See [Frontend README](./frontend/README.md) for detailed information.

## Database

The application uses PostgreSQL for data storage with the following features:

- **PostgreSQL 16**: A robust, production-ready relational database
- **Flyway Migrations**: Version-controlled database schema changes
- **Transaction Management**: Proper transaction handling for data integrity
- **Connection Pooling**: Efficient database connection management via HikariCP
- **Test Containers**: Integration tests with real PostgreSQL instances

### Database Schema

The main table structure:

- `bugs` - Stores all bug reports with the following fields:
  - `id` (BIGSERIAL): Primary key
  - `title` (VARCHAR): Bug title/summary
  - `description` (TEXT): Detailed description of the bug
  - `screenshot_url` (VARCHAR): URL to screenshot showing the bug
  - `created_at` (TIMESTAMP): When the bug was reported
  - `status` (VARCHAR): Current status (OPEN, IN_PROGRESS, CLOSED)
  - `priority` (VARCHAR): Bug priority (LOW, MEDIUM, HIGH, CRITICAL)

### Database Migration Strategy

This project uses Flyway for database migrations. Migrations are SQL scripts that are applied in order to create or modify the database schema. Each migration is applied only once and in a specific order.

#### Migration Files

Migration files follow the Flyway naming convention: `V{version}__{description}.sql`

- `V1__Create_bugs_table.sql`: Creates the initial bugs table
- `V2__Add_priority_field.sql`: Adds the priority field to the bugs table

#### Running Migrations

Migrations run automatically when the application starts. The migration scripts are located in:

```
backend/src/main/resources/db/migration
```

To add a new migration:

1. Create a new SQL file in the migration directory
2. Name it following the convention (e.g., `V3__Add_new_feature.sql`)
3. Write your SQL statements
4. Migrations will be applied in order when the application starts

### Database Configuration

The database connection is configured in the following files:

- `application.properties`: Default configuration for local development
- `application-docker.properties`: Configuration for Docker deployment
- `application-test.properties`: Configuration for tests

#### Production Best Practices

For production environments, the following best practices are implemented:

1. **Connection Pooling**: HikariCP manages database connections efficiently
2. **Transaction Management**: `@Transactional` annotations ensure data integrity
3. **Schema Validation**: Hibernate validates the schema against the entity model
4. **Indexed Queries**: Database indexes for frequently queried columns
5. **Secure Credentials**: Environment variables for sensitive information

## Getting Started

### Prerequisites

- Java 17 or higher
- Node.js and npm
- Docker (for containerized deployment)

### Running the Application

1. Start the backend:
   ```
   cd backend
   ./gradlew bootRun
   ```

2. Start the frontend:
   ```
   cd frontend
   npm install
   npm run dev
   ```

3. Access the application at http://localhost:5173

## Docker Deployment

You can use Docker Compose to run the entire application stack (frontend, backend, and database):

```
docker-compose up --build
```

This will:
1. Create a PostgreSQL database container with persistent volume
2. Build and start the backend container (connecting to the database)
3. Build and start the frontend container
4. Make the application available at http://localhost

The backend API will also be directly accessible at http://localhost:8080/api/bugs

### Database Connection Details

When running with Docker Compose:
- Host: `db` (container name)
- Port: `5432`
- Database: `bugreporter`
- Username: `buguser`
- Password: `bugpassword`

## Testing

The project includes multiple levels of testing:

### Unit Tests

Unit tests verify individual components in isolation:

```
cd backend
./gradlew test --tests "com.example.bugreporter.service.BugServiceTest"
```

### Integration Tests with TestContainers

Integration tests use TestContainers to spin up a real PostgreSQL database during testing:

```
cd backend
./gradlew test --tests "com.example.bugreporter.integration.*"
```

TestContainers automatically:
1. Starts a PostgreSQL container
2. Configures the test to use this container
3. Tears down the container after tests complete

This approach ensures that tests run against the same database type used in production, providing higher confidence in the test results.

### Running All Tests

To run all tests:

```
cd backend
./gradlew test
```

## Maintenance and Troubleshooting

### Common Issues

1. **Database Migration Failed**: Check the logs for specific error messages. You may need to manually fix the database schema or create a new migration.

2. **Connection Refused**: Ensure the database container is running and healthy:
   ```
   docker compose ps
   ```

3. **Schema Validation Errors**: If you see errors like "wrong column type encountered", ensure your entity classes match the database schema.

### Database Maintenance

To access the PostgreSQL command line:

```
docker compose exec db psql -U buguser -d bugreporter
```

Useful commands:
- `\dt`: List tables
- `\d bugs`: Describe the bugs table
- `SELECT * FROM flyway_schema_history;`: View migration history
