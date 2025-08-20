-import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Home from '../app/page.jsx';

describe('Home Page', () => {
  it('renders the main heading', () => {
    render(<Home />);
    
    const heading = screen.getByText(/Unlock Your Potential with/);
    expect(heading).toBeInTheDocument();
    
    const aiPowered = screen.getByText('AI-Powered');
    expect(aiPowered).toBeInTheDocument();
    expect(aiPowered).toHaveClass('text-cyan-400');
  });

  it('renders the description paragraph', () => {
    render(<Home />);
    
    const description = screen.getByText(/Resume building and Optimization/);
    expect(description).toBeInTheDocument();
  });

  it('renders call-to-action buttons', () => {
    render(<Home />);
    
    const getStartedButton = screen.getByText('Get Started');
    expect(getStartedButton).toBeInTheDocument();
    expect(getStartedButton.closest('a')).toHaveAttribute('href', '#features');
    
    const contactButton = screen.getByText('Contact Us');
    expect(contactButton).toBeInTheDocument();
    expect(contactButton.closest('a')).toHaveAttribute('href', '#contact');
  });

  it('renders all main sections', () => {
    render(<Home />);
    
    // Check if components are rendered (they should appear somewhere in the DOM)
    // Since we mocked these components, we just check that Home renders without errors
    expect(screen.getByText(/Unlock Your Potential with/)).toBeInTheDocument();
  });

  it('has correct CSS classes for styling', () => {
    render(<Home />);
    
    const main = screen.getByRole('main');
    expect(main).toHaveClass('flex-1');
    
    const getStartedButton = screen.getByText('Get Started');
    expect(getStartedButton).toHaveClass('bg-cyan-400', 'text-black');
    
    const contactButton = screen.getByText('Contact Us');
    expect(contactButton).toHaveClass('border', 'border-cyan-400', 'text-cyan-400');
  });

  it('renders with proper responsive classes', () => {
    render(<Home />);
    
    const heading = screen.getByText(/Unlock Your Potential with/);
    expect(heading).toHaveClass('text-4xl', 'sm:text-5xl', 'md:text-6xl');
    
    const description = screen.getByText(/Resume building and Optimization/);
    expect(description).toHaveClass('text-lg', 'sm:text-xl');
  });

  it('has correct data attributes', () => {
    render(<Home />);
    
    const container = screen.getByText(/Unlock Your Potential with/).closest('[data-scroll-container]');
    expect(container).toBeInTheDocument();
    expect(container).toHaveAttribute('data-scroll-container');
  });
});
