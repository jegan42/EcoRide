// frontend/src/__tests__/services/vehicleService.test.tsx
import vehicleService from '../../services/vehicleService';
import api from '../../api/axios';
import { vi } from 'vitest';

vi.mock('../../api/axios');

describe('vehicleService', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('createVehicle appelle api.post avec les bons paramètres', async () => {
    const mockVehicle = { id: 'v1', brand: 'Tesla' };
    (api.post as jest.Mock).mockResolvedValue({ data: mockVehicle });

    const result = await vehicleService.createVehicle({ brand: 'Tesla' });

    expect(api.post).toHaveBeenCalledWith(
      expect.stringMatching(/\/vehicles$/),
      { brand: 'Tesla' },
      { withCredentials: true }
    );
    expect(result).toEqual(mockVehicle);
  });

  it('fetchVehicles appelle api.get et retourne la liste des véhicules', async () => {
    const mockData = [{ id: 'v1' }, { id: 'v2' }];
    (api.get as jest.Mock).mockResolvedValue({ data: mockData });

    const result = await vehicleService.fetchVehicles();

    expect(api.get).toHaveBeenCalledWith(expect.stringMatching(/\/vehicles$/), {
      withCredentials: true,
    });
    expect(result).toEqual(mockData);
  });

  it("fetchVehicleById appelle api.get avec l'id", async () => {
    const vehicleId = 'v123';
    const mockVehicle = { id: vehicleId, brand: 'Renault' };
    (api.get as jest.Mock).mockResolvedValue({ data: mockVehicle });

    const result = await vehicleService.fetchVehicleById(vehicleId);

    expect(api.get).toHaveBeenCalledWith(
      expect.stringMatching(new RegExp(`/vehicles/${vehicleId}$`)),
      { withCredentials: true }
    );
    expect(result).toEqual(mockVehicle);
  });

  it('updateVehicle appelle api.put avec id et les données', async () => {
    const vehicleId = 'v123';
    const updates = { brand: 'Peugeot' };
    const mockResponse = { id: vehicleId, ...updates };
    (api.put as jest.Mock).mockResolvedValue({ data: mockResponse });

    const result = await vehicleService.updateVehicle(vehicleId, updates);

    expect(api.put).toHaveBeenCalledWith(
      expect.stringMatching(new RegExp(`/vehicles/${vehicleId}$`)),
      updates,
      { withCredentials: true }
    );
    expect(result).toEqual(mockResponse);
  });

  it('deleteVehicle appelle api.delete avec id', async () => {
    const vehicleId = 'v999';
    (api.delete as jest.Mock).mockResolvedValue({});

    await vehicleService.deleteVehicle(vehicleId);

    expect(api.delete).toHaveBeenCalledWith(
      expect.stringMatching(new RegExp(`/vehicles/${vehicleId}$`)),
      { withCredentials: true }
    );
  });
});
