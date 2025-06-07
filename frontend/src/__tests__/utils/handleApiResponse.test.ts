// frontend/src/__tests__/utils/handleApiResponse.test.ts
import { describe, it, expect } from 'vitest';
import {
  handleApiResponseSafe,
  handleApiResponseBasic,
} from '../../utils/handleApiResponse';

describe('handleApiResponseSafe', () => {
  it('returns the answer when everything is correct', () => {
    const response = {
      message: 'OK',
      data: { id: 1, name: 'Test' },
    };
    expect(handleApiResponseSafe(response)).toEqual(response);
  });

  it('throws an error if the response is null or not an object', () => {
    expect(() => handleApiResponseSafe(null)).toThrow(
      'Réponse invalide du serveur'
    );
    expect(() => handleApiResponseSafe(undefined)).toThrow(
      'Réponse invalide du serveur'
    );
    expect(() => handleApiResponseSafe(123)).toThrow(
      'Réponse invalide du serveur'
    );
    expect(() => handleApiResponseSafe('string')).toThrow(
      'Réponse invalide du serveur'
    );
  });

  it('throws an error if data is missing or falsy', () => {
    expect(() => handleApiResponseSafe({ message: 'ok' })).toThrow(
      'Aucune donnée reçue du serveur'
    );
    expect(() => handleApiResponseSafe({ message: 'ok', data: null })).toThrow(
      'Aucune donnée reçue du serveur'
    );
    expect(() =>
      handleApiResponseSafe({ message: 'ok', data: undefined })
    ).toThrow('Aucune donnée reçue du serveur');
  });
});

describe('handleApiResponseBasic', () => {
  it('returns the response with message and data', () => {
    const response = {
      message: 'Succès',
      data: { value: 42 },
    };
    expect(handleApiResponseBasic(response)).toEqual({
      message: 'Succès',
      data: { value: 42 },
    });
  });

  it('returns the response with message and data undefined by default', () => {
    const response = { message: 'Ok' };
    expect(handleApiResponseBasic(response)).toEqual({
      message: 'Ok',
      data: undefined,
    });
  });

  it('throws an error if response is not subject or message is missing', () => {
    expect(() => handleApiResponseBasic(null)).toThrow(
      'Réponse invalide ou message manquant'
    );
    expect(() => handleApiResponseBasic(undefined)).toThrow(
      'Réponse invalide ou message manquant'
    );
    expect(() => handleApiResponseBasic(123)).toThrow(
      'Réponse invalide ou message manquant'
    );
    expect(() => handleApiResponseBasic({})).toThrow(
      'Réponse invalide ou message manquant'
    );
    expect(() => handleApiResponseBasic({ data: {} })).toThrow(
      'Réponse invalide ou message manquant'
    );
  });
});
