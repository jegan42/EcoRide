// frontend/src/__tests__/utils/handleApiError.test.ts
import { describe, it, expect } from 'vitest';
import { extractApiError } from '../../utils/handleApiError';

describe('extractApiError', () => {
  it('retourne message depuis AxiosError avec data.message', () => {
    const error = {
      isAxiosError: true,
      response: { data: { message: 'Erreur API message' } },
      message: 'Erreur réseau',
    };

    expect(extractApiError(error)).toBe('Erreur API message');
  });

  it('retourne error depuis AxiosError avec data.error', () => {
    const error = {
      isAxiosError: true,
      response: { data: { error: 'Erreur API error' } },
      message: 'Erreur réseau',
    };

    expect(extractApiError(error)).toBe('Erreur API error');
  });

  it('retourne error.message si AxiosError sans data.message ni data.error', () => {
    const error = {
      isAxiosError: true,
      response: { data: {} },
      message: 'Erreur réseau fallback',
    };

    expect(extractApiError(error)).toBe('Erreur réseau fallback');
  });

  it('retourne message depuis une instance normale de Error', () => {
    const error = new Error('Erreur JS normale');

    expect(extractApiError(error)).toBe('Erreur JS normale');
  });

  it('retourne message inconnu pour une erreur inconnue', () => {
    expect(extractApiError('some string')).toBe(
      'Une erreur inconnue est survenue'
    );
    expect(extractApiError(42)).toBe('Une erreur inconnue est survenue');
    expect(extractApiError(null)).toBe('Une erreur inconnue est survenue');
  });
});
