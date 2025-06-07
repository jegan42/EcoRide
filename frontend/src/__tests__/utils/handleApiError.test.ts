// frontend/src/__tests__/utils/handleApiError.test.ts
import { describe, it, expect } from 'vitest';
import { extractApiError } from '../../utils/handleApiError';

describe('extractApiError', () => {
  it('returns message from AxiosError with data.message', () => {
    const error = {
      isAxiosError: true,
      response: { data: { message: 'Erreur API message' } },
      message: 'Erreur réseau',
    };

    expect(extractApiError(error)).toBe('Erreur API message');
  });

  it('returns error from AxiosError with data.error', () => {
    const error = {
      isAxiosError: true,
      response: { data: { error: 'Erreur API error' } },
      message: 'Erreur réseau',
    };

    expect(extractApiError(error)).toBe('Erreur API error');
  });

  it('returns error.message if AxiosError without data.message or data.error', () => {
    const error = {
      isAxiosError: true,
      response: { data: {} },
      message: 'Erreur réseau fallback',
    };

    expect(extractApiError(error)).toBe('Erreur réseau fallback');
  });

  it('returns message from a normal Error instance', () => {
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
