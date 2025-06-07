// frontend/src/__tests__/components/vehicle/VehicleFormSwitch.test.tsx
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { VehicleFormSwitch } from '../../../components/vehicle/VehicleFormSwitch';
import { vi } from 'vitest';
import { useVehicle } from '../../../hooks/useVehicle';
import type { VehicleEnergy } from '../../../types/vehicle';

vi.mock('../../../hooks/useVehicle');

describe('VehicleFormSwitch', () => {
  const mockOnSetVehicleMode = vi.fn();
  const mockCreateVehicle = vi.fn();
  const mockUpdateVehicle = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useVehicle as jest.Mock).mockReturnValue({
      onCreateVehicle: mockCreateVehicle,
      onUpdateVehicle: mockUpdateVehicle,
    });
  });

  it('displays the add form', () => {
    render(
      <VehicleFormSwitch
        selectedVehicle={null}
        isSubmitting={false}
        vehicleMode="add"
        onSetVehicleMode={mockOnSetVehicleMode}
      />
    );

    expect(screen.getByText(/ajouter un véhicule/i)).toBeInTheDocument();
  });

  it('displays the edit form if vehicle is selected', () => {
    const vehicle = {
      id: '123',
      userId: 'user-Id',
      brand: 'Renault',
      model: 'Clio',
      vehicleYear: 2020,
      color: 'Bleu',
      licensePlate: 'AB-123-CD',
      energy: 'essence' as VehicleEnergy,
      seatCount: 5,
      createdAt: String(new Date()),
      updatedAt: String(new Date()),
    };

    render(
      <VehicleFormSwitch
        selectedVehicle={vehicle}
        isSubmitting={false}
        vehicleMode="edit"
        onSetVehicleMode={mockOnSetVehicleMode}
      />
    );

    expect(screen.getByText(/modifier un véhicule/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/Renault/i)).toBeInTheDocument();
  });

  it('returns nothing if vehicleMode=edit without selectedVehicle', () => {
    const { container } = render(
      <VehicleFormSwitch
        selectedVehicle={null}
        isSubmitting={false}
        vehicleMode="edit"
        onSetVehicleMode={mockOnSetVehicleMode}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('successfully submits the add form and changes the mode to "view"', async () => {
    const mockOnSetVehicleMode = vi.fn();
    const mockOnCreateVehicle = vi.fn().mockResolvedValue(true);
    const mockOnUpdateVehicle = vi.fn();

    vi.mocked(useVehicle).mockReturnValue({
      vehicles: [],
      vehicle: undefined,
      loading: false,
      error: null,
      isSubmitting: false,
      onDeleteVehicle: vi.fn(),
      onCreateVehicle: mockOnCreateVehicle,
      onUpdateVehicle: mockOnUpdateVehicle,
    });

    render(
      <VehicleFormSwitch
        selectedVehicle={null}
        isSubmitting={false}
        vehicleMode="add"
        onSetVehicleMode={mockOnSetVehicleMode}
      />
    );

    fireEvent.change(screen.getByLabelText(/marque/i), {
      target: { value: 'Toyota' },
    });
    fireEvent.change(screen.getByLabelText(/modèle/i), {
      target: { value: 'Corolla' },
    });
    fireEvent.change(screen.getByLabelText(/couleur/i), {
      target: { value: 'Rouge' },
    });
    fireEvent.change(screen.getByLabelText(/année du véhicule/i), {
      target: { value: '2022' },
    });
    fireEvent.change(screen.getByLabelText(/plaque d’immatriculation/i), {
      target: { value: 'AB-123-CD' },
    });
    fireEvent.mouseDown(screen.getByLabelText(/énergie/i));
    fireEvent.click(await screen.findByText(/Essence/i));
    fireEvent.change(screen.getByLabelText(/nombre de places/i), {
      target: { value: '5' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sauvegarder/i }));

    await waitFor(() => {
      expect(mockOnCreateVehicle).toHaveBeenCalled();
      expect(mockOnSetVehicleMode).toHaveBeenCalledWith('view');
    });
  });

  it('successfully submits the edit form and changes the mode to "view"', async () => {
    const mockOnSetVehicleMode = vi.fn();
    const mockOnCreateVehicle = vi.fn();
    const mockOnUpdateVehicle = vi.fn().mockResolvedValue(true);

    vi.mocked(useVehicle).mockReturnValue({
      vehicles: [],
      vehicle: undefined,
      loading: false,
      error: null,
      isSubmitting: false,
      onDeleteVehicle: vi.fn(),
      onCreateVehicle: mockOnCreateVehicle,
      onUpdateVehicle: mockOnUpdateVehicle,
    });

    const selectedVehicle = {
      id: '1',
      userId: 'user-Id',
      brand: 'Renault',
      model: 'Clio',
      color: 'Bleu',
      vehicleYear: 2020,
      licensePlate: 'XY-123-ZZ',
      energy: 'petrol' as VehicleEnergy,
      seatCount: 5,
      createdAt: String(new Date()),
      updatedAt: String(new Date()),
    };

    render(
      <VehicleFormSwitch
        selectedVehicle={selectedVehicle}
        isSubmitting={false}
        vehicleMode="edit"
        onSetVehicleMode={mockOnSetVehicleMode}
      />
    );

    fireEvent.change(screen.getByLabelText(/marque/i), {
      target: { value: 'Peugeot' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sauvegarder/i }));

    await waitFor(() => {
      expect(mockOnUpdateVehicle).toHaveBeenCalledWith(
        expect.objectContaining({ brand: 'Peugeot' })
      );
      expect(mockOnSetVehicleMode).toHaveBeenCalledWith('view');
    });
  });

  it('cancels the form entry and changes the mode to "view"', async () => {
    const mockOnSetVehicleMode = vi.fn();

    vi.mocked(useVehicle).mockReturnValue({
      vehicles: [],
      vehicle: undefined,
      loading: false,
      error: null,
      isSubmitting: false,
      onDeleteVehicle: vi.fn(),
      onCreateVehicle: vi.fn(),
      onUpdateVehicle: vi.fn(),
    });

    render(
      <VehicleFormSwitch
        selectedVehicle={null}
        isSubmitting={false}
        vehicleMode="add"
        onSetVehicleMode={mockOnSetVehicleMode}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /annuler/i }));

    await waitFor(() => {
      expect(mockOnSetVehicleMode).toHaveBeenCalledWith('view');
    });
  });

  it('cancels the form entry and changes the mode to "view"', async () => {
    const mockOnSetVehicleMode = vi.fn();

    vi.mocked(useVehicle).mockReturnValue({
      vehicles: [],
      vehicle: undefined,
      loading: false,
      error: null,
      isSubmitting: false,
      onDeleteVehicle: vi.fn(),
      onCreateVehicle: vi.fn(),
      onUpdateVehicle: vi.fn(),
    });

    const selectedVehicle = {
      id: '1',
      userId: 'user-Id',
      brand: 'Renault',
      model: 'Clio',
      color: 'Bleu',
      vehicleYear: 2020,
      licensePlate: 'XY-123-ZZ',
      energy: 'petrol' as VehicleEnergy,
      seatCount: 5,
      createdAt: String(new Date()),
      updatedAt: String(new Date()),
    };

    render(
      <VehicleFormSwitch
        selectedVehicle={selectedVehicle}
        isSubmitting={false}
        vehicleMode="edit"
        onSetVehicleMode={mockOnSetVehicleMode}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /annuler/i }));

    await waitFor(() => {
      expect(mockOnSetVehicleMode).toHaveBeenCalledWith('view');
    });
  });

  it('cancels the change in "edit" mode and changes the mode to "view"', async () => {
    const mockOnSetVehicleMode = vi.fn();

    vi.mocked(useVehicle).mockReturnValue({
      vehicles: [],
      vehicle: undefined,
      loading: false,
      error: null,
      isSubmitting: false,
      onDeleteVehicle: vi.fn(),
      onCreateVehicle: vi.fn(),
      onUpdateVehicle: vi.fn(),
    });

    const vehicle = {
      id: '1',
      brand: 'Toyota',
      model: 'Corolla',
      color: 'Rouge',
      vehicleYear: 2020,
      licensePlate: 'AB-123-CD',
      energy: 'petrol' as VehicleEnergy,
      seatCount: 5,
      photo: '',
      userId: 'user1',
      createdAt: '',
      updatedAt: '',
    };

    render(
      <VehicleFormSwitch
        selectedVehicle={vehicle}
        isSubmitting={false}
        vehicleMode="edit"
        onSetVehicleMode={mockOnSetVehicleMode}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /annuler/i }));

    await waitFor(() => {
      expect(mockOnSetVehicleMode).toHaveBeenCalledWith('view');
    });
  });

  it('submits the data in "add" mode and changes the mode to "view" if successful', async () => {
    const mockOnSetVehicleMode = vi.fn();
    const mockOnUpdateVehicle = vi.fn();
    const mockOnCreateVehicle = vi.fn().mockResolvedValue(true);

    vi.mocked(useVehicle).mockReturnValue({
      vehicles: [],
      vehicle: undefined,
      loading: false,
      error: null,
      isSubmitting: false,
      onDeleteVehicle: vi.fn(),
      onCreateVehicle: mockOnCreateVehicle,
      onUpdateVehicle: mockOnUpdateVehicle,
    });

    render(
      <VehicleFormSwitch
        selectedVehicle={null}
        isSubmitting={false}
        vehicleMode="add"
        onSetVehicleMode={mockOnSetVehicleMode}
      />
    );

    fireEvent.change(screen.getByLabelText(/marque/i), {
      target: { value: 'Peugeot' },
    });

    fireEvent.change(screen.getByLabelText(/modèle/i), {
      target: { value: '308' },
    });

    fireEvent.change(screen.getByLabelText(/couleur/i), {
      target: { value: 'Bleu' },
    });

    fireEvent.change(screen.getByLabelText(/année du véhicule/i), {
      target: { value: '2022' },
    });

    fireEvent.change(screen.getByLabelText(/plaque d’immatriculation/i), {
      target: { value: 'CD-456-EF' },
    });

    fireEvent.change(screen.getByLabelText(/nombre de places/i), {
      target: { value: '5' },
    });

    fireEvent.change(screen.getByLabelText(/photo/i), {
      target: { value: 'http://image.jpg' },
    });

    fireEvent.mouseDown(screen.getByLabelText(/énergie/i));
    fireEvent.click(screen.getByText(/essence/i));

    fireEvent.click(screen.getByRole('button', { name: /sauvegarder/i }));

    await waitFor(() => {
      expect(mockOnCreateVehicle).toHaveBeenCalled();
      expect(mockOnSetVehicleMode).toHaveBeenCalledWith('view');
    });
  });

  it('submits the data in "edit" mode and changes the mode to "view" if successful', async () => {
    const mockOnSetVehicleMode = vi.fn();
    const mockOnUpdateVehicle = vi.fn().mockResolvedValue(true);

    vi.mocked(useVehicle).mockReturnValue({
      vehicles: [],
      vehicle: undefined,
      loading: false,
      error: null,
      isSubmitting: false,
      onDeleteVehicle: vi.fn(),
      onCreateVehicle: vi.fn(),
      onUpdateVehicle: mockOnUpdateVehicle,
    });

    const vehicle = {
      id: '1',
      brand: 'Toyota',
      model: 'Corolla',
      color: 'Rouge',
      vehicleYear: 2020,
      licensePlate: 'AB-123-CD',
      energy: 'petrol' as VehicleEnergy,
      seatCount: 5,
      photo: '',
      userId: 'user1',
      createdAt: '',
      updatedAt: '',
    };

    render(
      <VehicleFormSwitch
        selectedVehicle={vehicle}
        isSubmitting={false}
        vehicleMode="edit"
        onSetVehicleMode={mockOnSetVehicleMode}
      />
    );

    fireEvent.change(screen.getByLabelText(/marque/i), {
      target: { value: 'Peugeot' },
    });

    fireEvent.change(screen.getByLabelText(/modèle/i), {
      target: { value: '308' },
    });

    fireEvent.change(screen.getByLabelText(/couleur/i), {
      target: { value: 'Bleu' },
    });

    fireEvent.change(screen.getByLabelText(/année du véhicule/i), {
      target: { value: '2022' },
    });

    fireEvent.change(screen.getByLabelText(/plaque d’immatriculation/i), {
      target: { value: 'CD-456-EF' },
    });

    fireEvent.change(screen.getByLabelText(/nombre de places/i), {
      target: { value: '5' },
    });

    fireEvent.change(screen.getByLabelText(/photo/i), {
      target: { value: 'http://image.jpg' },
    });

    fireEvent.mouseDown(screen.getByLabelText(/énergie/i));
    fireEvent.click(screen.getByText(/diesel/i));

    fireEvent.click(screen.getByRole('button', { name: /sauvegarder/i }));

    await waitFor(() => {
      expect(mockOnUpdateVehicle).toHaveBeenCalled();
      expect(mockOnSetVehicleMode).toHaveBeenCalledWith('view');
    });
  });

  it('call onSetVehicleMode("view") when onCancel is triggered in edit mode', () => {
    const mockOnSetVehicleMode = vi.fn();
    const mockOnUpdateVehicle = vi.fn().mockResolvedValue(true);

    vi.mocked(useVehicle).mockReturnValue({
      vehicles: [],
      vehicle: undefined,
      loading: false,
      error: null,
      isSubmitting: false,
      onDeleteVehicle: vi.fn(),
      onCreateVehicle: vi.fn(),
      onUpdateVehicle: mockOnUpdateVehicle,
    });

    const selectedVehicle = {
      id: '1',
      brand: 'Ford',
      model: 'Fiesta',
      color: 'Red',
      year: 2018,
      licensePlate: 'AB-123-CD',
      seats: 5,
      photo: '',
      energy: 'diesel' as VehicleEnergy,
      userId: 'user1',
      createdAt: '',
      updatedAt: '',
      vehicleYear: 2020,
      seatCount: 5,
    };

    render(
      <VehicleFormSwitch
        selectedVehicle={selectedVehicle}
        isSubmitting={false}
        vehicleMode="edit"
        onSetVehicleMode={mockOnSetVehicleMode}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /annuler/i }));

    expect(mockOnSetVehicleMode).toHaveBeenCalledWith('view');
  });

  it('do not change mode if CreateVehicle fails', async () => {
    const mockOnSetVehicleMode = vi.fn();
    const mockOnCreateVehicle = vi.fn().mockResolvedValue(false);

    vi.mocked(useVehicle).mockReturnValue({
      vehicles: [],
      vehicle: undefined,
      loading: false,
      error: null,
      isSubmitting: false,
      onDeleteVehicle: vi.fn(),
      onCreateVehicle: mockOnCreateVehicle,
      onUpdateVehicle: vi.fn(),
    });

    render(
      <VehicleFormSwitch
        selectedVehicle={null}
        isSubmitting={false}
        vehicleMode="add"
        onSetVehicleMode={mockOnSetVehicleMode}
      />
    );

    fireEvent.change(screen.getByLabelText(/marque/i), {
      target: { value: 'Test' },
    });
    fireEvent.change(screen.getByLabelText(/modèle/i), {
      target: { value: 'Car' },
    });
    fireEvent.change(screen.getByLabelText(/couleur/i), {
      target: { value: 'Noir' },
    });
    fireEvent.change(screen.getByLabelText(/année du véhicule/i), {
      target: { value: '2021' },
    });
    fireEvent.change(screen.getByLabelText(/plaque d’immatriculation/i), {
      target: { value: 'ZZ-999-ZZ' },
    });
    fireEvent.change(screen.getByLabelText(/nombre de places/i), {
      target: { value: '4' },
    });
    fireEvent.mouseDown(screen.getByLabelText(/énergie/i));
    fireEvent.click(screen.getByText(/essence/i));

    fireEvent.click(screen.getByRole('button', { name: /sauvegarder/i }));

    await waitFor(() => {
      expect(mockOnCreateVehicle).toHaveBeenCalled();
      expect(mockOnSetVehicleMode).not.toHaveBeenCalled();
    });
  });

  it('do not change the mode if onUpdateVehicle fails', async () => {
    const mockOnSetVehicleMode = vi.fn();
    const mockOnUpdateVehicle = vi.fn().mockResolvedValue(false);

    vi.mocked(useVehicle).mockReturnValue({
      vehicles: [],
      vehicle: undefined,
      loading: false,
      error: null,
      isSubmitting: false,
      onDeleteVehicle: vi.fn(),
      onCreateVehicle: vi.fn(),
      onUpdateVehicle: mockOnUpdateVehicle,
    });

    const selectedVehicle = {
      id: '1',
      brand: 'Renault',
      model: 'Megane',
      color: 'Gris',
      vehicleYear: 2019,
      licensePlate: 'ZZ-111-ZZ',
      energy: 'diesel' as VehicleEnergy,
      seatCount: 5,
      photo: '',
      userId: 'user1',
      createdAt: '',
      updatedAt: '',
    };

    render(
      <VehicleFormSwitch
        selectedVehicle={selectedVehicle}
        isSubmitting={false}
        vehicleMode="edit"
        onSetVehicleMode={mockOnSetVehicleMode}
      />
    );

    fireEvent.change(screen.getByLabelText(/marque/i), {
      target: { value: 'Citroën' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sauvegarder/i }));

    await waitFor(() => {
      expect(mockOnUpdateVehicle).toHaveBeenCalled();
      expect(mockOnSetVehicleMode).not.toHaveBeenCalled();
    });
  });
});
