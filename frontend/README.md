# Bug Reporter Frontend

This is the frontend application for the Bug Reporter, built with React.

## Overview

The Bug Reporter frontend provides a user interface for reporting and tracking bugs. It communicates with the backend API to perform CRUD operations on bug reports.

## Features

- View a list of all bug reports
- Submit new bug reports with title, description, and screenshot URL
- Delete existing bug reports
- Real-time feedback with loading states and error handling
- Responsive design with Tailwind CSS

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Axios for API requests

## Project Structure

- `/src/components` - React components
  - `BugForm.tsx` - Form for submitting new bug reports
  - `BugList.tsx` - List of bug reports with delete functionality
  - `Layout.tsx` - Layout component with header and footer
- `/src/api` - API client functions
  - `bugApi.ts` - Functions for interacting with the backend API
- `/src/hooks` - Custom React hooks
  - `useBugs.ts` - Hook for managing bug state and operations
- `/src/types` - TypeScript type definitions
  - `bug.ts` - Types for bug data models
- `/src/utils` - Utility functions
  - `dateUtils.ts` - Date formatting utilities

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
