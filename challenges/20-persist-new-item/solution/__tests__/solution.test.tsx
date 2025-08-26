import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import Solution from '../Solution';

beforeEach(() => {
  // @ts-ignore
  global.fetch = vi.fn(async (input) => {
    // simple mock that returns a list
    if (typeof input === 'string' && input.includes('/api/items')) {
      return { ok: true, json: async () => ([{ id: 1, title: 'Alpha' }, { id: 2, title: 'Bravo' }]) } as any;
    }
    return { ok: true, json: async () => ({}) } as any;
  });
});

it('Challenge 20 renders', async () => {
  render(<Solution />);
  // Basic smoke: look for something or ensure render doesn't throw
  await screen.findByText(/Alpha|Testing basics|Routing concept|E2E is covered|Challenge 01|Count:|Loading|none/i);
});
