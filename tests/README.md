# 🧪 Testing Guide for TalentoAI

This project uses **Vitest** and **React Testing Library** for simple and effective testing.

## 🚀 Quick Start

### Install Dependencies

```bash
npm install
```

### Run Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode (automatically re-run when files change)
npm run test:watch

# Run tests with a nice UI interface
npm run test:ui

# Run tests with coverage report
npm run test:coverage

# Run Storybook tests
npm run test:storybook
```

## 📁 Test Structure

```text
tests/
├── setup.js                    # Test configuration
├── Navbar.test.jsx             # Navbar component tests
├── ContactSection.test.jsx     # Contact form tests  
├── Home.test.jsx               # Home page tests
├── getInitialFromName.test.js  # Utility function tests
└── contact-api.test.js         # API route tests
```

## 🧩 What's Tested

### ✅ Components

- **Navbar**: Navigation links, mobile menu, logo rendering
- **ContactSection**: Form validation, submission, error handling
- **Home Page**: Main content, buttons, responsive design

### ✅ Utilities

- **getInitialFromName**: Name parsing and edge cases

### ✅ API Routes

- **Contact API**: Request validation, email sending, error handling

## 📝 Writing New Tests

### Component Test Example

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MyComponent from '../app/components/MyComponent.jsx';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('handles click events', () => {
    render(<MyComponent />);
    const button = screen.getByText('Click me');
    fireEvent.click(button);
    // Add assertions here
  });
});
```

### API Test Example

```javascript
import { describe, it, expect, vi } from 'vitest';
import { POST } from '../app/api/my-route/route.js';

describe('My API Route', () => {
  it('returns success response', async () => {
    const mockRequest = {
      json: vi.fn().mockResolvedValue({ data: 'test' })
    };
    
    const response = await POST(mockRequest);
    expect(response.status).toBe(200);
  });
});
```

## 🔧 Test Configuration

### Vitest Config (`vitest.config.js`)

- **Environment**: jsdom (simulates browser environment)
- **Globals**: Enabled for describe, it, expect
- **Setup**: Automatic mocking of Next.js components
- **Projects**: Separate configs for unit tests and Storybook tests

### Setup File (`tests/setup.js`)

- **Mocks**: Next.js Image, Link, framer-motion, GSAP
- **Global utilities**: fetch mock, cleanup functions
- **Jest DOM**: Extended matchers for better assertions

## 🎯 Best Practices

### ✅ Do

- Test user interactions, not implementation details
- Use screen.getByRole() when possible
- Test error states and edge cases
- Keep tests simple and focused
- Use descriptive test names

### ❌ Don't

- Test internal component state
- Test CSS styles (unless critical for functionality)
- Write overly complex test setups
- Test third-party libraries

## 🐛 Troubleshooting

### Common Issues

**1. Tests fail with module errors**

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**2. Mock issues**

- Check that mocks are properly defined in `tests/setup.js`
- Ensure you're using the right mock for your use case

**3. Async test failures**

```javascript
// Use waitFor for async operations
await waitFor(() => {
  expect(screen.getByText('Success')).toBeInTheDocument();
});
```

**4. Component not found**

- Verify the component is properly exported
- Check import paths are correct
- Ensure component renders without errors

## 📊 Coverage Reports

View test coverage by running:

```bash
npm run test:coverage
```

This generates a detailed HTML report showing:

- Line coverage
- Function coverage  
- Branch coverage
- Uncovered lines

## 🔄 Continuous Integration

Tests automatically run when:

- Creating pull requests
- Pushing to main branch
- Running deployment scripts

## 📚 Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)

## 🆘 Need Help?

1. Run `npm run test:ui` for an interactive test interface
2. Check the console for detailed error messages
3. Look at existing tests for examples
4. Ensure all dependencies are installed with `npm install`
