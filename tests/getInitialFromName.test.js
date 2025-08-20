import { describe, it, expect } from 'vitest';
import { getInitialFromName } from '../utils/getInitialFromName.js';

describe('getInitialFromName', () => {
  it('returns the first character in uppercase for a valid name', () => {
    expect(getInitialFromName('John')).toBe('J');
    expect(getInitialFromName('alice')).toBe('A');
    expect(getInitialFromName('bob')).toBe('B');
  });

  it('handles names with spaces', () => {
    expect(getInitialFromName('John Doe')).toBe('J');
    expect(getInitialFromName('  Alice Smith  ')).toBe('A');
  });

  it('returns "?" for invalid inputs', () => {
    expect(getInitialFromName('')).toBe('?');
    expect(getInitialFromName('   ')).toBe('');
    expect(getInitialFromName(null)).toBe('?');
    expect(getInitialFromName(undefined)).toBe('?');
    expect(getInitialFromName(123)).toBe('?');
    expect(getInitialFromName({})).toBe('?');
    expect(getInitialFromName([])).toBe('?');
  });

  it('handles special characters', () => {
    expect(getInitialFromName('@john')).toBe('@');
    expect(getInitialFromName('1name')).toBe('1');
    expect(getInitialFromName('-test')).toBe('-');
  });

  it('handles empty string after trimming', () => {
    expect(getInitialFromName('   ')).toBe('');
    expect(getInitialFromName('\t\n')).toBe('');
  });
});
