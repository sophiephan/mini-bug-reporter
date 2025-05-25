# Bug Reporter Frontend

This is the frontend application for the Bug Reporter, built with React.

## Overview

The Bug Reporter frontend provides a user interface for reporting and tracking bugs. It communicates with the backend API to perform CRUD operations on bug reports.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS

## Getting Started

### Prerequisites

- Node.js and npm

### Installation

1. Navigate to the frontend directory
2. Install dependencies:
   ```
   npm install
   ```

### Development

Start the development server:

```
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

Build the application:

```
npm run build
```

The build output will be in the `dist` directory.

## Docker

The frontend can be containerized using Docker:

```
docker build -t bug-reporter-frontend .
```

Run the container:

```
docker run -p 80:80 bug-reporter-frontend
```

Or use Docker Compose from the root directory to run both frontend and backend:

```
docker-compose up --build
```
