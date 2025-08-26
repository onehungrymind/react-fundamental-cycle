import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import Solution from '../Solution';

it('Challenge 06 renders', async () => {
  render(<Solution />);
  // Basic smoke: look for something or ensure render doesn't throw
  expect(screen.getByText(/./)).toBeInTheDocument();
});
