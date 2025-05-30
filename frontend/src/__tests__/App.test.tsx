// frontend/src/__tests__/App.test.tsx
import { render, screen } from '@testing-library/react';
import App from '../App';
import { vi } from 'vitest';

vi.mock('../router/AppRouter', () => ({
  __esModule: true,
  default: () => <div>Mock AppRouter</div>,
}));

describe('App.tsx', () => {
  it('render le provider avec AppRouter', () => {
    render(<App />);
    expect(screen.getByText('Mock AppRouter')).toBeInTheDocument();
  });
});
