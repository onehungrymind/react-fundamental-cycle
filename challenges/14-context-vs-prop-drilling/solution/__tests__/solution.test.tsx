import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import Solution from '../Solution';

it('Challenge 14 renders', async () => {
  render(<Solution />);
  // Basic smoke: look for something or ensure render doesn't throw
  expect(screen.getByText(/./)).toBeInTheDocument();
});
