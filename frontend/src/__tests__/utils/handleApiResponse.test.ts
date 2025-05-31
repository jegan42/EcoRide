// frontend/src/__tests__/utils/handleApiResponse.test.ts
import { describe, it, expect } from 'vitest';
import {
  handleApiResponseSafe,
  handleApiResponseBasic,
} from '../../utils/handleApiResponse';

describe('handleApiResponseSafe', () => {
  it('retourne la réponse quand tout est correct', () => {
    const response = {
      message: 'OK',
      data: { id: 1, name: 'Test' },
    };
    expect(handleApiResponseSafe(response)).toEqual(response);
  });

  it('lance une erreur si la réponse est null ou non objet', () => {
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

  it('lance une erreur si data est manquant ou falsy', () => {
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
  it('retourne la réponse avec message et data', () => {
    const response = {
      message: 'Succès',
      data: { value: 42 },
    };
    expect(handleApiResponseBasic(response)).toEqual({
      message: 'Succès',
      data: { value: 42 },
    });
  });

  it('retourne la réponse avec message et data undefined par défaut', () => {
    const response = { message: 'Ok' };
    expect(handleApiResponseBasic(response)).toEqual({
      message: 'Ok',
      data: undefined,
    });
  });

  it('lance une erreur si réponse n’est pas objet ou message manquant', () => {
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
