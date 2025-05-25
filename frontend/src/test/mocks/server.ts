import { setupServer } from 'msw/node';
import { handlers } from './handlers';
import { beforeAll, afterEach, afterAll } from 'vitest';

export const server = setupServer(...handlers);

// Start the server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Reset handlers after each test
afterEach(() => server.resetHandlers());

// Close server after all tests
afterAll(() => server.close()); 