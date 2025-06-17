// frontend/src/__tests__/services/vehicleService.test.tsx
import vehicleService from '../../services/vehicleService';
import api from '../../api/axios';
import { vi } from 'vitest';

vi.mock('../../api/axios');

describe('vehicleService', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('createVehicle calls api.post with the correct parameters', async () => {
    const mockVehicle = { id: 'v1', brand: 'tesla' };
    (api.post as jest.Mock).mockResolvedValue({
      data: {
        message: 'createVehicle successful',
        data: mockVehicle,
      },
    });

    const result = await vehicleService.createVehicle({ brand: 'tesla' });

    expect(api.post).toHaveBeenCalledWith(
      expect.stringMatching(/\/vehicles$/),
      { brand: 'tesla' },
      { withCredentials: true }
    );
    expect(result.message).toBe('createVehicle successful');
    expect(result.data).toEqual(mockVehicle);
  });

  it('fetchVehicles calls api.get and returns the list of vehicles', async () => {
    const mockData = [{ id: 'v1' }, { id: 'v2' }];
    (api.get as jest.Mock).mockResolvedValue({
      data: {
        message: 'getAllVehicles successful',
        data: mockData,
      },
    });

    const result = await vehicleService.fetchVehicles();

    expect(api.get).toHaveBeenCalledWith(expect.stringMatching(/\/vehicles$/), {
      withCredentials: true,
    });
    expect(result.message).toBe('getAllVehicles successful');
    expect(result.data).toEqual(mockData);
  });

  it('fetchVehicleById calls api.get with the id', async () => {
    const vehicleId = 'v123';
    const mockVehicle = { id: vehicleId, brand: 'Renault' };
    (api.get as jest.Mock).mockResolvedValue({
      data: {
        message: 'getVehicleById successful',
        data: mockVehicle,
      },
    });

    const result = await vehicleService.fetchVehicleById(vehicleId);

    expect(api.get).toHaveBeenCalledWith(
      expect.stringMatching(new RegExp(`/vehicles/${vehicleId}$`)),
      { withCredentials: true }
    );
    expect(result.message).toBe('getVehicleById successful');
    expect(result.data).toEqual(mockVehicle);
  });

  it('updateVehicle appelle api.put avec id et les données', async () => {
    const vehicleId = 'v123';
    const updates = { brand: 'peugeot' };
    const mockResponse = { id: vehicleId, ...updates };
    (api.put as jest.Mock).mockResolvedValue({
      data: {
        message: 'updateVehicle successful',
        data: mockResponse,
      },
    });

    const result = await vehicleService.updateVehicle(vehicleId, updates);

    expect(api.put).toHaveBeenCalledWith(
      expect.stringMatching(new RegExp(`/vehicles/${vehicleId}$`)),
      updates,
      { withCredentials: true }
    );
    expect(result.message).toBe('updateVehicle successful');
    expect(result.data).toEqual(mockResponse);
  });

  it('deleteVehicle appelle api.delete avec id', async () => {
    const vehicleId = 'v999';
    (api.delete as jest.Mock).mockResolvedValue({
      data: { message: 'deletedVehicle successful' },
    });

    const result = await vehicleService.deleteVehicle(vehicleId);

    expect(result.message).toBe('deletedVehicle successful');
    expect(api.delete).toHaveBeenCalledWith(
      expect.stringMatching(new RegExp(`/vehicles/${vehicleId}$`)),
      { withCredentials: true }
    );
  });
});
