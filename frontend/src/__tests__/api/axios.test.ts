// frontend/src/__tests__/api/axios.test.ts
import api from '../../api/axios';
import { vi } from 'vitest';
import { enqueueSnackbar } from 'notistack';
import MockAdapter from 'axios-mock-adapter';

vi.mock('notistack', () => ({
  enqueueSnackbar: vi.fn(),
}));

describe('axios instance', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(api);
    vi.clearAllMocks();
  });

  afterEach(() => {
    mock.restore();
  });

  it('utilise la bonne baseURL et en-têtes', () => {
    expect(api.defaults.baseURL).toBeDefined();
    expect(api.defaults.withCredentials).toBe(true);
    expect(api.defaults.headers['Content-Type']).toBe('application/json');
  });

  it('intercepte les erreurs et affiche une notification', async () => {
    const errorMessage = 'Erreur personnalisée';

    mock.onGet('/test').reply(400, { message: errorMessage });

    await expect(api.get('/test')).rejects.toBeDefined();

    expect(enqueueSnackbar).toHaveBeenCalledWith(errorMessage, {
      variant: 'error',
    });
  });

  it('gère les erreurs inconnues', async () => {
    mock.onGet('/autre').networkError();

    await expect(api.get('/autre')).rejects.toBeDefined();

    expect(enqueueSnackbar).toHaveBeenCalledWith('Erreur serveur inconnue.', {
      variant: 'error',
    });
  });

  it('laisse passer une réponse sans erreur (cas succès)', async () => {
    const responseData = { success: true };

    mock.onGet('/success').reply(200, responseData);

    const response = await api.get('/success');

    expect(response.status).toBe(200);
    expect(response.data).toEqual(responseData);
    expect(enqueueSnackbar).not.toHaveBeenCalled();
  });

  it('ajoute le header X-CSRF-Token si présent dans le store', async () => {
    const csrfToken = 'test-csrf-token';

    vi.mock('../../store', async () => {
      const actual = await vi.importActual('../../store');
      return {
        ...actual,
        store: {
          getState: () => ({
            auth: {
              csrfToken: 'test-csrf-token',
            },
          }),
        },
      };
    });

    const axiosInstance = (await import('../../api/axios')).default;
    const mock = new MockAdapter(axiosInstance);

    mock.onGet('/csrf-test').reply((config) => {
      expect(config.headers?.['X-CSRF-Token']).toBe(csrfToken);
      return [200, { ok: true }];
    });

    const response = await axiosInstance.get('/csrf-test');
    expect(response.status).toBe(200);
  });
});
