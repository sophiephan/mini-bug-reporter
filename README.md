# Mini Bug Reporter

A full-stack application for reporting and tracking bugs in software projects.

## Project Structure

- `/frontend` - React frontend application
- `/backend` - Spring Boot backend API

## Backend

The backend is built with Spring Boot and provides a RESTful API for managing bug reports.

See [Backend README](./backend/README.md) for detailed information.

## Frontend

The frontend is built with React and provides a user interface for interacting with the bug reporting system.

## Getting Started

### Prerequisites

- Java 17 or higher
- Node.js and npm
- Docker (optional, for containerized deployment)

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

You can use Docker Compose to run both the frontend and backend:

```
docker-compose up --build
```

This will:
1. Build the Docker images for both the frontend and backend
2. Start the containers
3. Make the application available at http://localhost

The backend API will also be directly accessible at http://localhost:8080/api/bugs
