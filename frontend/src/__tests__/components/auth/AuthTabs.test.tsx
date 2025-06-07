// frontend/src/__tests__/auth/AuthTabs.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { AuthTabs } from '../../../components/auth/AuthTabs';
import { describe, it, expect, vi } from 'vitest';

describe('AuthTabs', () => {
  it('correctly displays buttons with the correct active style', () => {
    const onChange = vi.fn();
    const { rerender } = render(<AuthTabs active={true} onChange={onChange} />);

    const btnSeConnecter = screen.getByRole('button', {
      name: /se connecter/i,
    });
    const btnSinscrire = screen.getByRole('button', { name: /s’inscrire/i });

    expect(btnSeConnecter).toHaveStyle('font-weight: 700');
    expect(btnSinscrire).toHaveStyle('font-weight: 400');

    rerender(<AuthTabs active={false} onChange={onChange} />);
    expect(btnSeConnecter).toHaveStyle('font-weight: 400');
    expect(btnSinscrire).toHaveStyle('font-weight: 700');
  });

  it('calls onChange with true when "Login" is clicked', () => {
    const onChange = vi.fn();
    render(<AuthTabs active={false} onChange={onChange} />);

    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('calls onChange with false when clicking "Register"', () => {
    const onChange = vi.fn();
    render(<AuthTabs active={true} onChange={onChange} />);

    fireEvent.click(screen.getByRole('button', { name: /s’inscrire/i }));
    expect(onChange).toHaveBeenCalledWith(false);
  });
});
