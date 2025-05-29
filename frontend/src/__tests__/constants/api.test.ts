// frontend/src/__tests__/constants/api.test.tsx
import { getApiUrl } from '../../constants/api';

describe('getApiUrl', () => {
  it('use default value if VITE_API_URL undefined', () => {
    expect(
      getApiUrl({
        BASE_URL: '',
        MODE: '',
        DEV: false,
        PROD: false,
        SSR: false,
        VITE_API_URL: undefined,
      })
    ).toBe('http://localhost:4000/api');
  });

  it('use VITE_API_URL value if defined', () => {
    expect(
      getApiUrl({
        BASE_URL: '',
        MODE: '',
        DEV: false,
        PROD: false,
        SSR: false,
        VITE_API_URL: 'https://mocked.api.com',
      })
    ).toBe('https://mocked.api.com');
  });
});
