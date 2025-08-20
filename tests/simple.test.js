import { describe, it, expect } from 'vitest';

describe('Simple Tests', () => {
  it('should add numbers correctly', () => {
    expect(1 + 2).toBe(3);
  });

  it('should check string equality', () => {
    expect('hello').toBe('hello');
  });

  it('should work with arrays', () => {
    const arr = [1, 2, 3];
    expect(arr.length).toBe(3);
    expect(arr).toContain(2);
  });

  it('should handle async operations', async () => {
    const promise = new Promise(resolve => setTimeout(() => resolve('done'), 10));
    const result = await promise;
    expect(result).toBe('done');
  });

  it('should test fetch mock', () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'success' })
    });

    expect(global.fetch).toBeDefined();
  });
});
