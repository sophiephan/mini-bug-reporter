# React and TypeScript UI Testing Guide

This guide covers the fundamentals of testing React applications with TypeScript, using the Mini Bug Reporter as a practical example.

## Table of Contents

1. [Testing Setup](#testing-setup)
2. [Types of Tests](#types-of-tests)
3. [Component Testing](#component-testing)
4. [Hook Testing](#hook-testing)
5. [API Mocking](#api-mocking)
6. [Best Practices](#best-practices)

## Testing Setup

Our project uses the following testing tools:

- **Vitest**: A fast Vite-native testing framework
- **React Testing Library**: For testing React components
- **MSW (Mock Service Worker)**: For mocking API requests
- **Jest DOM**: For additional DOM matchers

### Installation

```bash
npm install --save-dev vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event msw
```

### Configuration

Create a `vitest.config.ts` file:

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
  },
});
```

Create a setup file (`src/test/setup.ts`):

```typescript
import '@testing-library/jest-dom';
```

## Types of Tests

### Unit Tests
Testing individual functions or components in isolation.

### Integration Tests
Testing how multiple components work together.

### End-to-End Tests
Testing the entire application flow (not covered in this guide).

## Component Testing

### Basic Component Test

Here's how to test a simple component:

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });
});
```

### Testing User Interactions

Use `userEvent` to simulate user interactions:

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Counter } from './Counter';

describe('Counter', () => {
  it('increments count when button is clicked', async () => {
    const user = userEvent.setup();
    render(<Counter />);
    
    const button = screen.getByRole('button', { name: /increment/i });
    await user.click(button);
    
    expect(screen.getByText('Count: 1')).toBeInTheDocument();
  });
});
```

### Testing Forms

Example from our Bug Form component:

```typescript
it('should call onSubmit with form data when valid', async () => {
  const user = userEvent.setup();
  const onSubmitMock = vi.fn().mockResolvedValue(true);
  
  render(<BugForm onSubmit={onSubmitMock} />);
  
  const titleInput = screen.getByLabelText(/Title/i);
  const descriptionInput = screen.getByLabelText(/Description/i);
  const submitButton = screen.getByRole('button', { name: /Submit Bug Report/i });
  
  await user.type(titleInput, 'Test Bug');
  await user.type(descriptionInput, 'This is a test bug description');
  await user.click(submitButton);
  
  expect(onSubmitMock).toHaveBeenCalledWith({
    title: 'Test Bug',
    description: 'This is a test bug description'
  });
});
```

## Hook Testing

Testing custom hooks requires `renderHook` from Testing Library:

```typescript
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  it('should increment counter', () => {
    const { result } = renderHook(() => useCounter());
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });
});
```

Example from our useBugs hook:

```typescript
it('should fetch bugs on mount', async () => {
  const mockFetchBugs = vi.mocked(bugApi.fetchBugs).mockResolvedValue(mockBugs);
  
  const { result } = renderHook(() => useBugs());
  
  // Initially loading
  expect(result.current.loading).toBe(true);
  
  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });
  
  expect(mockFetchBugs).toHaveBeenCalledTimes(1);
  expect(result.current.bugs).toEqual(mockBugs);
  expect(result.current.error).toBeNull();
});
```

## API Mocking

### Using vi.mock for Direct API Mocking

```typescript
import { vi } from 'vitest';
import * as api from './api';

vi.mock('./api', () => ({
  fetchData: vi.fn(),
}));

describe('Component using API', () => {
  it('fetches data on mount', async () => {
    vi.mocked(api.fetchData).mockResolvedValue({ data: 'test' });
    // Test component that uses api.fetchData()
  });
});
```

### Using MSW for Network Request Mocking

MSW setup (`src/test/mocks/handlers.ts`):

```typescript
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/data', () => {
    return HttpResponse.json({ data: 'mocked data' });
  }),
  
  http.post('/api/submit', async ({ request }) => {
    const data = await request.json();
    return HttpResponse.json({ id: 1, ...data }, { status: 201 });
  })
];
```

Server setup (`src/test/mocks/server.ts`):

```typescript
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

## Best Practices

### 1. Test Behavior, Not Implementation

Focus on what the component does, not how it's implemented:

```typescript
// Good: Testing behavior
test('shows success message when form is submitted', async () => {
  // ...test code
  expect(screen.getByText(/submitted successfully/i)).toBeInTheDocument();
});

// Bad: Testing implementation
test('calls handleSubmit when form is submitted', async () => {
  const handleSubmit = vi.fn();
  // ...test code
  expect(handleSubmit).toHaveBeenCalled();
});
```

### 2. Use Accessible Queries

Prefer queries that reflect how users interact with your app:

```typescript
// Good: Uses accessible queries
const submitButton = screen.getByRole('button', { name: /submit/i });

// Avoid: Implementation details
const submitButton = screen.getByTestId('submit-button');
```

### 3. Mock Only What's Necessary

Only mock external dependencies that you don't want to test:

```typescript
// Good: Only mock API calls
vi.mock('./api');

// Avoid: Mocking too much
vi.mock('./utils');
vi.mock('./constants');
```

### 4. Test Edge Cases

Don't just test the happy path:

```typescript
it('shows error when API call fails', async () => {
  vi.mocked(api.fetchData).mockRejectedValue(new Error('API error'));
  
  render(<MyComponent />);
  
  await waitFor(() => {
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });
});
```

### 5. Keep Tests Independent

Each test should be independent and not rely on the state from previous tests:

```typescript
// Before each test, reset mocks and setup
beforeEach(() => {
  vi.resetAllMocks();
});
```

## Running Tests

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
```

Run tests with:

```bash
npm test           # Run tests once
npm run test:watch # Run in watch mode
npm run test:coverage # Generate coverage report
```

## Example Project Structure

```
src/
├── components/
│   ├── BugList.tsx
│   ├── BugList.test.tsx
│   ├── BugForm.tsx
│   └── BugForm.test.tsx
├── hooks/
│   ├── useBugs.ts
│   └── useBugs.test.ts
└── test/
    ├── setup.ts
    ├── utils.tsx
    └── mocks/
        ├── handlers.ts
        └── server.ts
```

This structure keeps tests close to the code they're testing, making it easier to maintain. 