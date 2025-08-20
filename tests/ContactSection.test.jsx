import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ContactSection from '../app/components/ContactSection.jsx';

describe('ContactSection Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    global.fetch.mockClear();
  });

  it('renders the contact form with all fields', () => {
    render(<ContactSection />);
    
    expect(screen.getByText('Contact & Support')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Your Name *')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Your Email *')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('How can we help you? *')).toBeInTheDocument();
    expect(screen.getByText('Send Message')).toBeInTheDocument();
  });

  it('updates form fields when user types', async () => {
    const user = userEvent.setup();
    render(<ContactSection />);
    
    const nameInput = screen.getByPlaceholderText('Your Name *');
    const emailInput = screen.getByPlaceholderText('Your Email *');
    const descriptionInput = screen.getByPlaceholderText('How can we help you? *');
    
    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(descriptionInput, 'This is a test message');
    
    expect(nameInput.value).toBe('John Doe');
    expect(emailInput.value).toBe('john@example.com');
    expect(descriptionInput.value).toBe('This is a test message');
  });

  it('shows validation error when submitting empty form', async () => {
    const user = userEvent.setup();
    render(<ContactSection />);
    
    const submitButton = screen.getByText('Send Message');
    
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Please fill in all required fields.')).toBeInTheDocument();
    });
  });

  it('shows validation error when name is missing', async () => {
    const user = userEvent.setup();
    render(<ContactSection />);
    
    const emailInput = screen.getByPlaceholderText('Your Email *');
    const descriptionInput = screen.getByPlaceholderText('How can we help you? *');
    const submitButton = screen.getByText('Send Message');
    
    await user.type(emailInput, 'john@example.com');
    await user.type(descriptionInput, 'This is a test message');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Please fill in all required fields.')).toBeInTheDocument();
    });
  });

  it('submits form successfully with valid data', async () => {
    const user = userEvent.setup();
    
    // Mock successful API response
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });
    
    render(<ContactSection />);
    
    const nameInput = screen.getByPlaceholderText('Your Name *');
    const emailInput = screen.getByPlaceholderText('Your Email *');
    const descriptionInput = screen.getByPlaceholderText('How can we help you? *');
    const submitButton = screen.getByText('Send Message');
    
    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(descriptionInput, 'This is a test message');
    await user.click(submitButton);
    
    // Check if fetch was called with correct data
    expect(global.fetch).toHaveBeenCalledWith('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        description: 'This is a test message',
      }),
    });
    
    await waitFor(() => {
      expect(screen.getByText(/Thank you! Your message has been sent successfully/)).toBeInTheDocument();
    });
  });

  it('shows error message when API request fails', async () => {
    const user = userEvent.setup();
    
    // Mock failed API response
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Server error' }),
    });
    
    render(<ContactSection />);
    
    const nameInput = screen.getByPlaceholderText('Your Name *');
    const emailInput = screen.getByPlaceholderText('Your Email *');
    const descriptionInput = screen.getByPlaceholderText('How can we help you? *');
    const submitButton = screen.getByText('Send Message');
    
    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(descriptionInput, 'This is a test message');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Server error')).toBeInTheDocument();
    });
  });

  it('shows network error message when fetch throws', async () => {
    const user = userEvent.setup();
    
    // Mock network error
    global.fetch.mockRejectedValueOnce(new Error('Network error'));
    
    render(<ContactSection />);
    
    const nameInput = screen.getByPlaceholderText('Your Name *');
    const emailInput = screen.getByPlaceholderText('Your Email *');
    const descriptionInput = screen.getByPlaceholderText('How can we help you? *');
    const submitButton = screen.getByText('Send Message');
    
    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(descriptionInput, 'This is a test message');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Network error. Please check your connection and try again.')).toBeInTheDocument();
    });
  });

  it('disables submit button while submitting', async () => {
    const user = userEvent.setup();
    
    // Mock a slow API response
    global.fetch.mockImplementationOnce(() => 
      new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        json: async () => ({ success: true }),
      }), 100))
    );
    
    render(<ContactSection />);
    
    const nameInput = screen.getByPlaceholderText('Your Name *');
    const emailInput = screen.getByPlaceholderText('Your Email *');
    const descriptionInput = screen.getByPlaceholderText('How can we help you? *');
    const submitButton = screen.getByText('Send Message');
    
    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(descriptionInput, 'This is a test message');
    await user.click(submitButton);
    
    // Button should show "Sending..." and be disabled
    expect(screen.getByText('Sending...')).toBeInTheDocument();
    expect(screen.getByText('Sending...')).toBeDisabled();
  });

  it('clears form after successful submission', async () => {
    const user = userEvent.setup();
    
    // Mock successful API response
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });
    
    render(<ContactSection />);
    
    const nameInput = screen.getByPlaceholderText('Your Name *');
    const emailInput = screen.getByPlaceholderText('Your Email *');
    const descriptionInput = screen.getByPlaceholderText('How can we help you? *');
    const submitButton = screen.getByText('Send Message');
    
    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(descriptionInput, 'This is a test message');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Thank you! Your message has been sent successfully/)).toBeInTheDocument();
    });
    
    // Form should be cleared
    expect(nameInput.value).toBe('');
    expect(emailInput.value).toBe('');
    expect(descriptionInput.value).toBe('');
  });
});
