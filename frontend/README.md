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

## Using the Configurable Bug Reporter in Your Own App

The Mini Bug Reporter is designed to be easily integrated into any web application while maintaining flexibility and reusability.

### Installation

1. Copy the following files to your project:
   - `src/components/BugReporter.tsx`
   - `src/components/BugReporterConfig.ts`
   - `src/types/bug.ts` (or just the types you need)

2. Install required dependencies if not already in your project:
   ```bash
   npm install axios
   ```

### Basic Usage

```tsx
import { BugReporter } from './components/BugReporter';

function MyApp() {
  return (
    <div>
      <h1>My Application</h1>
      
      {/* Other app content */}
      
      <BugReporter />
    </div>
  );
}
```

### Customization Options

You can customize the Bug Reporter by passing options:

```tsx
import { BugReporter } from './components/BugReporter';
import type { BugReporterOptions } from './components/BugReporterConfig';

function MyApp() {
  const options: BugReporterOptions = {
    // Hide features you don't need
    showDescription: true,
    showPriority: false,
    showScreenshotUrl: false,
    
    // Customize UI text
    title: 'Report an Issue',
    submitButtonText: 'Send Report',
    
    // Set a different API endpoint
    apiEndpoint: 'https://your-api.example.com/bugs',
    
    // Automatically include user context with each bug report
    getContextData: () => {
      return {
        reportedBy: 'user@example.com',
        sourcePage: window.location.pathname,
        appVersion: '1.2.3'
      };
    }
  };

  return (
    <div>
      <BugReporter 
        options={options}
        onSubmitSuccess={() => console.log('Bug reported!')}
        onSubmitError={(error) => console.error('Error:', error)}
      />
    </div>
  );
}
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `showDescription` | boolean | `true` | Show/hide description field |
| `showPriority` | boolean | `true` | Show/hide priority dropdown |
| `showScreenshotUrl` | boolean | `true` | Show/hide screenshot URL field |
| `defaultPriority` | string | `'MEDIUM'` | Default priority value |
| `title` | string | `'Report a Bug'` | Form title |
| `submitButtonText` | string | `'Submit Bug Report'` | Submit button text |
| `successMessage` | string | `'Bug report submitted successfully!'` | Success message |
| `apiEndpoint` | string | `'http://localhost:8080/api/bugs'` | API endpoint for submitting bugs |
| `getContextData` | function | `undefined` | Function that returns additional context data |

### Adding Context Data

The `getContextData` option allows you to automatically include additional information with each bug report:

```tsx
const options = {
  getContextData: () => {
    // Can be async or return a plain object
    return {
      // User information
      user: {
        id: getUserId(),
        email: getUserEmail()
      },
      
      // Environment information
      environment: process.env.NODE_ENV,
      appVersion: '1.2.3',
      
      // Current page/route
      currentPage: window.location.pathname,
      
      // Browser information
      userAgent: navigator.userAgent,
      
      // Any other context that might be helpful
      timestamp: new Date().toISOString()
    };
  }
};
```

See `src/examples/BugReporterIntegration.tsx` for a complete example.

## Testing Your Integration

To ensure your integration works correctly, follow these testing steps:

### Unit Testing the BugReporter Component

The BugReporter component has comprehensive unit tests that verify its functionality:

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode during development
npm run test:watch
```

### Manual Testing Checklist

1. **Basic Functionality**:
   - [ ] Form renders correctly with all configured fields
   - [ ] Required validation works (title is required)
   - [ ] Form submission works and sends data to API
   - [ ] Success message appears after submission
   - [ ] Error handling works when API fails

2. **Custom Context Data**:
   - [ ] Verify that custom context data is included in API requests
   - [ ] Check that user information is correctly captured
   - [ ] Confirm that page/route information is accurate

3. **UI Customization**:
   - [ ] Custom title appears correctly
   - [ ] Custom button text is displayed
   - [ ] Hidden fields are not rendered

### Testing with Mock API

You can test the frontend integration without a backend by using tools like MSW (Mock Service Worker):

```tsx
// Example using MSW to mock API responses
import { setupServer } from 'msw/node';
import { rest } from 'msw';

const server = setupServer(
  rest.post('http://localhost:8080/api/bugs', (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({ id: 1, title: req.body.title })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### End-to-End Testing

For a complete test of your integration:

1. Start your main application with the BugReporter component integrated
2. Start the Bug Reporter backend (or your own backend that handles bug reports)
3. Submit a test bug report through the UI
4. Verify the bug appears in the database

You can use the provided `test-integration.sh` script in the root directory to test the backend API.
