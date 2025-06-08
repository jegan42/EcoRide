// frontend/src/__tests__/components/preferences/PreferencesView.test.tsx
import { render, screen, type RenderResult } from '@testing-library/react';
import { vi } from 'vitest';
import { PreferencesView } from '../../../components/preferences/PreferencesView';
import { Provider } from 'react-redux';
import { configureStore, type EnhancedStore } from '@reduxjs/toolkit';
import { usePreferences } from '../../../hooks/usePreferences';

vi.mock('../../../hooks/usePreferences', () => ({
  usePreferences: vi.fn(),
}));

const mockPreferences = {
  preferences: {
    acceptsSmoker: true,
    acceptsPets: false,
    acceptsMusic: true,
    acceptsChatter: false,
  },
};

const createMockStore = (): EnhancedStore =>
  configureStore({
    reducer: () => ({}),
  });

const renderWithProvider = (ui: React.ReactElement): RenderResult => {
  const store = createMockStore();
  return render(<Provider store={store}>{ui}</Provider>);
};

describe('PreferencesView', () => {
  it('displays user preferences', () => {
    (usePreferences as jest.Mock).mockReturnValue(mockPreferences);
    const mockFn = vi.fn();

    renderWithProvider(<PreferencesView onSetPreferencesMode={mockFn} />);

    expect(screen.getByText(/Accepte les fumeurs/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Accepté/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Accepte les animaux/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Pas accepté/i).length).toBeGreaterThan(0);
    expect(
      screen.getByRole('button', { name: /Modifier les préférences/i })
    ).toBeInTheDocument();
  });

  it('triggers edit mode when the edit button is clicked', () => {
    (usePreferences as jest.Mock).mockReturnValue(mockPreferences);
    const mockFn = vi.fn();
    renderWithProvider(<PreferencesView onSetPreferencesMode={mockFn} />);

    const editButton = screen.getByRole('button', {
      name: /Modifier les préférences/i,
    });

    editButton.click();
    expect(mockFn).toHaveBeenCalledWith('edit');
  });

  it('displays the Add Preferences button if preferences does not exist', () => {
    (usePreferences as jest.Mock).mockReturnValue({ preferences: null });
    const mockFn = vi.fn();
    renderWithProvider(<PreferencesView onSetPreferencesMode={mockFn} />);

    expect(
      screen.getByText(/Vous n’avez encore enregistré aucune préférence./i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Ajouter des préférences/i })
    ).toBeInTheDocument();
  });

  it('triggers add mode when clicking the "Add preferences" button"', () => {
    (usePreferences as jest.Mock).mockReturnValue({ preferences: null });
    const mockFn = vi.fn();
    renderWithProvider(<PreferencesView onSetPreferencesMode={mockFn} />);

    const addButton = screen.getByRole('button', {
      name: /Ajouter des préférences/i,
    });

    addButton.click();

    expect(mockFn).toHaveBeenCalledWith('add');
  });
});
