import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Global test utilities
global.fetch = vi.fn();

// Reset mocks before each test
beforeEach(() => {
  fetch.mockClear();
});
