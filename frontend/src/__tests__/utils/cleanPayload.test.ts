// frontend/src/tests/utils/cleanPayload.test.ts
import { cleanPayload } from '../../utils/cleanPayload';

describe('cleanPayload', () => {
  it('retourne un objet identique si aucun champ vide', () => {
    const input = { name: 'Alice', age: 30 };
    const result = cleanPayload(input);
    expect(result).toEqual(input);
  });

  it('supprime les champs avec des chaînes vides', () => {
    const input = { name: 'Bob', age: '', city: 'Paris' };
    const result = cleanPayload(input);
    expect(result).toEqual({ name: 'Bob', city: 'Paris' });
  });

  it('retourne un objet vide si tous les champs sont vides', () => {
    const input = { a: '', b: '', c: '' };
    const result = cleanPayload(input);
    expect(result).toEqual({});
  });

  it('ne supprime pas les valeurs null ou undefined', () => {
    const input = { a: null, b: undefined, c: '' };
    const result = cleanPayload(input);
    expect(result).toEqual({ a: null, b: undefined });
  });
});
