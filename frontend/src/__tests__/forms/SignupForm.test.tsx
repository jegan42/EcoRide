// frontend/src/__tests__/forms/SignupForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignupForm from '../../forms/SignupForm';
import { vi } from 'vitest';

describe('SignupForm', () => {
  it('displays errors if fields are empty or invalid', async () => {
    render(<SignupForm onSubmit={() => {}} />);
    fireEvent.change(screen.getByLabelText(/avatar/i), {
      target: { value: 'invalid-url' },
    });
    fireEvent.click(screen.getByRole('button', { name: /s’inscrire/i }));

    expect(await screen.findByText(/Prénom requis/i)).toBeInTheDocument();
    expect(await screen.findByText(/^Nom requis/i)).toBeInTheDocument();
    expect(
      await screen.findByText(/Nom d'utilisateur trop court/i)
    ).toBeInTheDocument();
    expect(await screen.findByText(/Email invalide/i)).toBeInTheDocument();
    expect(
      await screen.findByText(
        /Le mot de passe doit faire au moins 8 caractères/i
      )
    ).toBeInTheDocument();
    expect(await screen.findByText(/Téléphone requis/i)).toBeInTheDocument();
    expect(await screen.findByText(/Adresse requise/i)).toBeInTheDocument();
    expect(await screen.findByText(/URL invalide/i)).toBeInTheDocument();
    expect(
      await screen.findAllByText(/requis|invalide|court|moins/i)
    ).toHaveLength(8);
  });

  it('calls onSubmit with valid data', async () => {
    const handleSubmit = vi.fn();
    render(<SignupForm onSubmit={handleSubmit} />);

    fireEvent.change(screen.getByLabelText(/prénom/i), {
      target: { value: 'Jean' },
    });
    fireEvent.change(screen.getByLabelText(/^nom$/i), {
      target: { value: 'Dupont' },
    });
    fireEvent.change(screen.getByLabelText(/nom d'utilisateur/i), {
      target: { value: 'jdupont' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'jean@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/mot de passe/i), {
      target: { value: 'Test123!' },
    });
    fireEvent.change(screen.getByLabelText(/téléphone/i), {
      target: { value: '0123456789' },
    });
    fireEvent.change(screen.getByLabelText(/adresse/i), {
      target: { value: '123 rue Paris' },
    });

    fireEvent.click(screen.getByRole('button', { name: /s’inscrire/i }));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalled();
    });
  });
});
