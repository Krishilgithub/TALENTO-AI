import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../app/api/contact/route.js';

// Mock nodemailer
vi.mock('nodemailer', () => ({
  default: {
    createTransporter: vi.fn(() => ({
      sendMail: vi.fn(),
    })),
  },
}));

// Mock NextResponse
vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn((data, options) => ({
      json: () => Promise.resolve(data),
      status: options?.status || 200,
      data,
      options,
    })),
  },
}));

describe('Contact API Route', () => {
  let mockRequest;
  let mockTransporter;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock request object
    mockRequest = {
      json: vi.fn(),
    };

    // Mock transporter
    mockTransporter = {
      sendMail: vi.fn(),
    };

    // Mock nodemailer.createTransporter to return our mock
    const nodemailer = require('nodemailer');
    nodemailer.default.createTransporter.mockReturnValue(mockTransporter);
  });

  it('returns error when required fields are missing', async () => {
    mockRequest.json.mockResolvedValue({
      name: '',
      email: 'test@example.com',
      description: 'Test message',
    });

    const response = await POST(mockRequest);

    expect(response.status).toBe(400);
    expect(response.data.error).toBe('Name, email, and description are required fields.');
  });

  it('returns error when email is missing', async () => {
    mockRequest.json.mockResolvedValue({
      name: 'John Doe',
      email: '',
      description: 'Test message',
    });

    const response = await POST(mockRequest);

    expect(response.status).toBe(400);
    expect(response.data.error).toBe('Name, email, and description are required fields.');
  });

  it('returns error when description is missing', async () => {
    mockRequest.json.mockResolvedValue({
      name: 'John Doe',
      email: 'test@example.com',
      description: '',
    });

    const response = await POST(mockRequest);

    expect(response.status).toBe(400);
    expect(response.data.error).toBe('Name, email, and description are required fields.');
  });

  it('sends email successfully with valid data', async () => {
    const requestData = {
      name: 'John Doe',
      email: 'test@example.com',
      description: 'This is a test message',
    };

    mockRequest.json.mockResolvedValue(requestData);
    mockTransporter.sendMail.mockResolvedValue({ messageId: 'test-id' });

    const response = await POST(mockRequest);

    expect(mockTransporter.sendMail).toHaveBeenCalledOnce();
    expect(response.status).toBe(200);
    expect(response.data.message).toBe('Email sent successfully!');

    // Check if sendMail was called with correct parameters
    const mailOptions = mockTransporter.sendMail.mock.calls[0][0];
    expect(mailOptions.subject).toContain('John Doe');
    expect(mailOptions.html).toContain('John Doe');
    expect(mailOptions.html).toContain('test@example.com');
    expect(mailOptions.html).toContain('This is a test message');
  });

  it('handles email sending errors', async () => {
    const requestData = {
      name: 'John Doe',
      email: 'test@example.com',
      description: 'This is a test message',
    };

    mockRequest.json.mockResolvedValue(requestData);
    mockTransporter.sendMail.mockRejectedValue(new Error('SMTP Error'));

    const response = await POST(mockRequest);

    expect(response.status).toBe(500);
    expect(response.data.error).toBe('Failed to send email. Please try again later.');
  });

  it('handles JSON parsing errors', async () => {
    mockRequest.json.mockRejectedValue(new Error('Invalid JSON'));

    const response = await POST(mockRequest);

    expect(response.status).toBe(500);
    expect(response.data.error).toBe('Failed to send email. Please try again later.');
  });

  it('includes all required email fields', async () => {
    const requestData = {
      name: 'Jane Smith',
      email: 'jane@example.com',
      description: 'Hello from Jane',
    };

    mockRequest.json.mockResolvedValue(requestData);
    mockTransporter.sendMail.mockResolvedValue({ messageId: 'test-id' });

    await POST(mockRequest);

    const mailOptions = mockTransporter.sendMail.mock.calls[0][0];
    
    expect(mailOptions).toHaveProperty('from');
    expect(mailOptions).toHaveProperty('to');
    expect(mailOptions).toHaveProperty('subject');
    expect(mailOptions).toHaveProperty('html');
    expect(mailOptions).toHaveProperty('text');
    
    expect(mailOptions.to).toBe('talentoai702@gmail.com');
    expect(mailOptions.subject).toContain('Jane Smith');
  });
});
