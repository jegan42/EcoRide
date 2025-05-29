// frontend/src/__tests__/forms/SigninForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SigninForm from '../../forms/SigninForm';
import { vi } from 'vitest';

describe('SigninForm', () => {
  it('displays errors if email or password is missing', async () => {
    render(<SigninForm onSubmit={() => {}} />);

    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));

    expect(await screen.findByText(/email invalide/i)).toBeInTheDocument();
    expect(
      await screen.findByText(
        /le mot de passe doit faire au moins 8 caractères/i
      )
    ).toBeInTheDocument();
  });

  it('calls onSubmit when the form is valid', async () => {
    const handleSubmit = vi.fn();
    render(<SigninForm onSubmit={handleSubmit} />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/mot de passe/i), {
      target: { value: 'Password123!' },
    });

    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalled();
    });
  });
});
