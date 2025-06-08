// frontend/src/__tests__/components/preferences/PreferencesForm.test.tsx
import { render, screen } from '@testing-library/react';
import { PreferencesForm } from '../../../components/preferences/PreferencesForm';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

describe('PreferencesForm', () => {
  const mockSubmit = vi.fn();
  const mockCancel = vi.fn();

  const setup = (defaultValues = {}): void => {
    render(
      <PreferencesForm
        defaultValues={defaultValues}
        isSubmitting={false}
        onSubmit={mockSubmit}
        onCancel={mockCancel}
      />
    );
  };

  it('affiche les checkbox avec les bons labels', () => {
    setup();

    expect(screen.getByLabelText(/Accepte les fumeurs/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Accepte les animaux/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Accepte la musique/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Accepte la conversation/i)
    ).toBeInTheDocument();
  });

  it('submits the data correctly', async () => {
    setup();
    const user = userEvent.setup();

    await user.click(screen.getByLabelText(/Accepte les fumeurs/i));
    await user.click(screen.getByLabelText(/Accepte la musique/i));

    await user.click(screen.getByRole('button', { name: /Sauvegarder/i }));
    expect(mockSubmit).toHaveBeenCalled();
    expect(mockSubmit.mock.calls[0][0]).toEqual({
      acceptsSmoker: true,
      acceptsPets: false,
      acceptsMusic: true,
      acceptsChatter: false,
    });
  });

  it('cancel the form', async () => {
    setup();
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /Annuler/i }));

    expect(mockCancel).toHaveBeenCalled();
  });
});
