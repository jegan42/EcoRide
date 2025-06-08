// frontend/src/__tests__/components/preferences/PreferencesFormSwitch.test.tsx
import {
  render,
  screen,
  fireEvent,
  waitFor,
  type RenderResult,
} from '@testing-library/react';
import { PreferencesFormSwitch } from '../../../components/preferences/PreferencesFormSwitch';
import { vi } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore, type EnhancedStore } from '@reduxjs/toolkit';
import { usePreferences } from '../../../hooks/usePreferences';

vi.mock('../../../hooks/usePreferences');

const mockCreate = vi.fn().mockResolvedValue(true);
const mockUpdate = vi.fn().mockResolvedValue(true);

const createMockStore = (): EnhancedStore =>
  configureStore({
    reducer: () => ({}),
  });

const renderWithStore = (ui: React.ReactElement): RenderResult => {
  const store = createMockStore();
  return render(<Provider store={store}>{ui}</Provider>);
};

describe('PreferencesFormSwitch', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the add form', async () => {
    (usePreferences as jest.Mock).mockReturnValue({
      preferences: null,
      onCreatePreferences: mockCreate,
      onUpdatePreferences: mockUpdate,
    });

    const onSetPreferencesMode = vi.fn();

    renderWithStore(
      <PreferencesFormSwitch
        preferencesMode="add"
        isSubmitting={false}
        onSetPreferencesMode={onSetPreferencesMode}
      />
    );

    expect(screen.getByText(/Ajouter les préférences/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /sauvegarder/i }));
  });

  it('renders the edit form with default values', () => {
    (usePreferences as jest.Mock).mockReturnValue({
      preferences: {
        acceptsSmoker: true,
        acceptsPets: false,
        acceptsMusic: true,
        acceptsChatter: false,
      },
      onCreatePreferences: mockCreate,
      onUpdatePreferences: mockUpdate,
    });

    const onSetPreferencesMode = vi.fn();

    renderWithStore(
      <PreferencesFormSwitch
        preferencesMode="edit"
        isSubmitting={false}
        onSetPreferencesMode={onSetPreferencesMode}
      />
    );

    expect(screen.getByText(/Modifier les préférences/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Accepte les fumeurs/i)).toBeChecked();
  });

  it('returns null if edit mode without preferences', () => {
    (usePreferences as jest.Mock).mockReturnValue({
      preferences: null,
      onCreatePreferences: mockCreate,
      onUpdatePreferences: mockUpdate,
    });

    const { container } = renderWithStore(
      <PreferencesFormSwitch
        preferencesMode="edit"
        isSubmitting={false}
        onSetPreferencesMode={vi.fn()}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('returns null if mode not supported', () => {
    (usePreferences as jest.Mock).mockReturnValue({
      preferences: null,
      onCreatePreferences: mockCreate,
      onUpdatePreferences: mockUpdate,
    });

    const { container } = renderWithStore(
      <PreferencesFormSwitch
        preferencesMode="view"
        isSubmitting={false}
        onSetPreferencesMode={vi.fn()}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('calls onSetPreferencesMode("view") when onCancel is triggered in add mode', () => {
    (usePreferences as jest.Mock).mockReturnValue({
      preferences: null,
      onCreatePreferences: mockCreate,
      onUpdatePreferences: mockUpdate,
    });

    const onSetPreferencesMode = vi.fn();

    renderWithStore(
      <PreferencesFormSwitch
        preferencesMode="add"
        isSubmitting={false}
        onSetPreferencesMode={onSetPreferencesMode}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /annuler/i }));
    expect(onSetPreferencesMode).toHaveBeenCalledWith('view');
  });

  it('submits preferences in edit mode and redirects to view if successful', async () => {
    (usePreferences as jest.Mock).mockReturnValue({
      preferences: {
        acceptsSmoker: true,
        acceptsPets: false,
        acceptsMusic: true,
        acceptsChatter: false,
      },
      onCreatePreferences: mockCreate,
      onUpdatePreferences: mockUpdate,
    });

    const onSetPreferencesMode = vi.fn();

    renderWithStore(
      <PreferencesFormSwitch
        preferencesMode="edit"
        isSubmitting={false}
        onSetPreferencesMode={onSetPreferencesMode}
      />
    );
    fireEvent.click(screen.getByLabelText(/accepte les animaux/i));

    fireEvent.click(screen.getByRole('button', { name: /sauvegarder/i }));
    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalled();
    });

    expect(onSetPreferencesMode).toHaveBeenCalledWith('view');
  });

  it('calls onSetPreferencesMode("view") when onCancel is triggered in edit mode', () => {
    (usePreferences as jest.Mock).mockReturnValue({
      preferences: {
        acceptsSmoker: true,
        acceptsPets: false,
        acceptsMusic: true,
        acceptsChatter: false,
      },
      onCreatePreferences: mockCreate,
      onUpdatePreferences: mockUpdate,
    });

    const onSetPreferencesMode = vi.fn();

    renderWithStore(
      <PreferencesFormSwitch
        preferencesMode="edit"
        isSubmitting={false}
        onSetPreferencesMode={onSetPreferencesMode}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /annuler/i }));
    expect(onSetPreferencesMode).toHaveBeenCalledWith('view');
  });

  it('redirects to view if onCreatePreferences succeeds (add mode)', async () => {
    const mockCreate = vi.fn().mockResolvedValue(true);
    (usePreferences as jest.Mock).mockReturnValue({
      preferences: null,
      onCreatePreferences: mockCreate,
      onUpdatePreferences: vi.fn(),
    });

    const onSetPreferencesMode = vi.fn();

    renderWithStore(
      <PreferencesFormSwitch
        preferencesMode="add"
        isSubmitting={false}
        onSetPreferencesMode={onSetPreferencesMode}
      />
    );

    const checkbox = screen.getByLabelText(/Accepte les fumeurs/i);
    fireEvent.click(checkbox);

    fireEvent.click(screen.getByRole('button', { name: /Sauvegarder/i }));

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(onSetPreferencesMode).toHaveBeenCalledWith('view');
    });
  });

  it('do not change the mode if onCreatePreferences fails (add mode)', async () => {
    const mockCreate = vi.fn().mockResolvedValue(false);
    (usePreferences as jest.Mock).mockReturnValue({
      preferences: null,
      onCreatePreferences: mockCreate,
      onUpdatePreferences: vi.fn(),
    });

    const onSetPreferencesMode = vi.fn();

    renderWithStore(
      <PreferencesFormSwitch
        preferencesMode="add"
        isSubmitting={false}
        onSetPreferencesMode={onSetPreferencesMode}
      />
    );

    const checkbox = screen.getByLabelText(/Accepte les fumeurs/i);
    fireEvent.click(checkbox);
    fireEvent.click(screen.getByRole('button', { name: /Sauvegarder/i }));

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(onSetPreferencesMode).not.toHaveBeenCalled();
    });
  });

  it('redirects to view if onUpdatePreferences succeeds (edit mode)', async () => {
    const mockUpdate = vi.fn().mockResolvedValue(true);
    (usePreferences as jest.Mock).mockReturnValue({
      preferences: {
        acceptsSmoker: false,
        acceptsPets: false,
        acceptsMusic: false,
        acceptsChatter: false,
      },
      onCreatePreferences: vi.fn(),
      onUpdatePreferences: mockUpdate,
    });

    const onSetPreferencesMode = vi.fn();

    renderWithStore(
      <PreferencesFormSwitch
        preferencesMode="edit"
        isSubmitting={false}
        onSetPreferencesMode={onSetPreferencesMode}
      />
    );

    const checkbox = screen.getByLabelText(/Accepte la musique/i);
    fireEvent.click(checkbox);

    fireEvent.click(screen.getByRole('button', { name: /Sauvegarder/i }));

    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(onSetPreferencesMode).toHaveBeenCalledWith('view');
    });
  });

  it('do not change the mode if onCreatePreferences fails (edit mode)', async () => {
    const mockUpdate = vi.fn().mockResolvedValue(false);
    (usePreferences as jest.Mock).mockReturnValue({
      preferences: {
        acceptsSmoker: false,
        acceptsPets: false,
        acceptsMusic: false,
        acceptsChatter: false,
      },
      onCreatePreferences: vi.fn(),
      onUpdatePreferences: mockUpdate,
    });

    const onSetPreferencesMode = vi.fn();

    renderWithStore(
      <PreferencesFormSwitch
        preferencesMode="edit"
        isSubmitting={false}
        onSetPreferencesMode={onSetPreferencesMode}
      />
    );

    const checkbox = screen.getByLabelText(/Accepte la musique/i);
    fireEvent.click(checkbox);

    fireEvent.click(screen.getByRole('button', { name: /Sauvegarder/i }));

    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(onSetPreferencesMode).not.toHaveBeenCalled();
    });
  });
});
