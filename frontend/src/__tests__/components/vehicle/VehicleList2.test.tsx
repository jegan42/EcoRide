// frontend/src/__tests__/components/vehicle/VehicleList2.test.tsx
import { vi } from 'vitest';

vi.mock('../../../hooks/useVehicle', () => ({
  useVehicle: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.resetModules();
});

describe('VehicleList', () => {
  it('ignore undefined vehicles', async () => {
    vi.mock('../../../components/vehicle/VehicleCard', () => ({
      VehicleCard: vi.fn(() => <div data-testid="vehicle-card" />),
    }));

    vi.mock('../../../hooks/useVehicle', () => ({
      useVehicle: () => ({
        vehicles: [undefined, null],
        onDeleteVehicle: vi.fn(),
      }),
    }));

    const { VehicleList } = await import(
      '../../../components/vehicle/VehicleList'
    );
    const { render, screen } = await import('@testing-library/react');

    render(
      <VehicleList onSetVehicleMode={vi.fn()} onSetSelectedVehicle={vi.fn()} />
    );

    expect(screen.queryByTestId('vehicle-card')).not.toBeInTheDocument();
  });
});
