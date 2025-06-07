// frontend/src/__tests__/components/vehicle/VehicleForm.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VehicleForm } from '../../../components/vehicle/VehicleForm';
import { vi } from 'vitest';
import type { VehicleEnergy } from '../../../types/vehicle';

describe('VehicleForm', () => {
  const defaultValues = {
    brand: 'Toyota',
    model: 'Yaris',
    color: 'Rouge',
    vehicleYear: 2020,
    licensePlate: 'AB-123-CD',
    energy: 'petrol' as VehicleEnergy,
    seatCount: 5,
    photo: 'https://example.com/photo.jpg',
  };

  it('submits the data correctly', async () => {
    const handleSubmit = vi.fn();
    const handleCancel = vi.fn();

    render(
      <VehicleForm
        isSubmitting={false}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    );

    await userEvent.type(screen.getByLabelText(/Marque/i), 'Toyota');
    await userEvent.type(screen.getByLabelText(/Modèle/i), 'Corolla');
    await userEvent.type(screen.getByLabelText(/Couleur/i), 'Bleu');
    await userEvent.type(
      screen.getByLabelText(/Plaque d’immatriculation/i),
      'AB-123-CD'
    );
    await userEvent.type(screen.getByLabelText(/Année du véhicule/i), '2020');
    await userEvent.type(screen.getByLabelText(/Nombre de places/i), '5');
    await userEvent.type(
      screen.getByLabelText(/Photo \(URL\)/i),
      'https://image.com'
    );

    await userEvent.click(screen.getByLabelText(/Énergie/i));
    await userEvent.click(screen.getByRole('option', { name: /essence/i }));

    await userEvent.click(screen.getByRole('button', { name: /Sauvegarder/i }));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          brand: 'Toyota',
          model: 'Corolla',
          color: 'Bleu',
          licensePlate: 'AB-123-CD',
          vehicleYear: 2020,
          seatCount: 5,
          photo: 'https://image.com',
          energy: 'petrol',
        })
      );
    });
  });

  it('disables the Save button if isSubmitting is true', () => {
    render(
      <VehicleForm
        defaultValues={defaultValues}
        isSubmitting={true}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    expect(screen.getByRole('button', { name: /Sauvegarder/i })).toBeDisabled();
  });

  it('displays validation errors if invalid data', async () => {
    render(
      <VehicleForm
        defaultValues={null}
        isSubmitting={false}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    await userEvent.click(screen.getByRole('button', { name: /Sauvegarder/i }));

    await waitFor(() => {
      expect(screen.getByText(/La marque est requise/i)).toBeInTheDocument();
      expect(screen.getByText(/Le modèle est requis/i)).toBeInTheDocument();
    });
  });

  it('calls onCancel when the Cancel button is clicked', async () => {
    const handleCancel = vi.fn();

    render(
      <VehicleForm
        defaultValues={defaultValues}
        isSubmitting={false}
        onSubmit={vi.fn()}
        onCancel={handleCancel}
      />
    );

    await userEvent.click(screen.getByRole('button', { name: /Annuler/i }));

    expect(handleCancel).toHaveBeenCalled();
  });
});
