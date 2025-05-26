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
| `showMetadataFields` | boolean | `false` | Show/hide custom metadata fields UI |
| `defaultPriority` | string | `'MEDIUM'` | Default priority value |
| `title` | string | `'Report a Bug'` | Form title |
| `submitButtonText` | string | `'Submit Bug Report'` | Submit button text |
| `successMessage` | string | `'Bug report submitted successfully!'` | Success message |
| `apiEndpoint` | string | `'http://localhost:8080/api/bugs'` | API endpoint for submitting bugs |
| `getContextData` | function | `undefined` | Function that returns additional context data |

### Adding Metadata

There are two ways to add metadata to bug reports:

#### 1. Custom Metadata UI Fields

Enable the metadata UI fields to allow users to manually enter custom key-value pairs:

```tsx
const options = {
  showMetadataFields: true
};
```

This will add a "Custom Metadata" section to the form where users can:
- Add any number of key-value pairs
- Remove unwanted fields
- Provide additional context that might be helpful for debugging

#### 2. Automatic Context Data

The `getContextData` option allows you to automatically include additional information with each bug report as metadata:

```tsx
const options = {
  getContextData: async () => {
    // Can be async or return a plain object
    return {
      // User information
      reportedBy: getUserEmail(),
      userId: getUserId(),
      
      // Environment information
      environment: process.env.NODE_ENV,
      appVersion: '1.2.3',
      
      // Current page/route
      currentPage: window.location.pathname,
      
      // Browser information
      userAgent: navigator.userAgent,
      
      // Any other context that might be helpful
      timestamp: Date.now()
    };
  }
};
```

##### Why Async Context Data?

The `getContextData` function is designed to be async for several important reasons:

1. **Flexibility for Real-World Use Cases**: Many real-world applications need to fetch context data asynchronously, such as:
   - User details from an authentication service
   - Application configuration from an API
   - Analytics data that might require asynchronous processing

2. **Error Handling**: Async functions with try/catch blocks provide a clean way to handle errors during context data collection, ensuring the form submission can still proceed even if metadata collection fails.

3. **Performance**: For expensive operations, async allows these to run without blocking the main thread, creating a better user experience.

4. **Future-Proofing**: By supporting async from the start, you won't need to change your interface later when you need to add asynchronous operations.

#### Combining Both Approaches

You can combine both approaches to allow users to add their own metadata while also automatically including system context:

```tsx
const options = {
  showMetadataFields: true,
  getContextData: () => ({
    reportedBy: getUserEmail(),
    appVersion: '1.2.3',
    environment: process.env.NODE_ENV
  })
};
```

When both are used, the metadata is merged, with manually entered fields taking precedence if there are any key conflicts.

### Viewing Metadata

Bug reports that include metadata will display this information in the bug list view. Each metadata key-value pair is shown in a structured format, making it easy to see important contextual information at a glance.

The metadata display automatically:
- Shows a "Metadata" section only when metadata is present
- Formats the key-value pairs in a clean, readable layout
- Handles different types of metadata values (strings, numbers, booleans)

This makes it easy to diagnose issues by seeing all relevant context about the bug report in one place.

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

2. **Custom Metadata**:
   - [ ] Verify that custom metadata fields can be added and removed
   - [ ] Check that metadata values are included in API requests
   - [ ] Test that automatically collected context data is merged correctly

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