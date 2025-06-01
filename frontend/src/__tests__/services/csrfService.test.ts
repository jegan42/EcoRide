// frontend/src/tests/services/csrfService.test.ts
import { getCsrfToken } from '../../services/csrfService';
import api from '../../api/axios';
import { API_URL } from '../../constants/api';
import { vi } from 'vitest';

vi.mock('../../api/axios', () => ({
  default: {
    get: vi.fn(),
  },
}));

vi.mock('../../utils/handleApiResponse', () => ({
  handleApiResponseSafe: vi.fn((data) => data),
}));

describe('getCsrfToken', () => {
  it('fait une requête GET au bon endpoint et retourne le token', async () => {
    const mockData = { message: 'OK', data: 'test-csrf-token' };
    (api.get as unknown as jest.Mock).mockResolvedValue({ data: mockData });

    const result = await getCsrfToken();

    expect(api.get).toHaveBeenCalledWith(`${API_URL}/csrf-token`);
    expect(result).toEqual(mockData);
  });
});
