// frontend/src/tests/utils/cleanPayload.test.ts
import { cleanPayload } from '../../utils/cleanPayload';

describe('cleanPayload', () => {
  it('returns an identical object if no empty field', () => {
    const input = { name: 'Alice', age: 30 };
    const result = cleanPayload(input);
    expect(result).toEqual(input);
  });

  it('removes fields with empty strings', () => {
    const input = { name: 'Bob', age: '', city: 'Paris' };
    const result = cleanPayload(input);
    expect(result).toEqual({ name: 'Bob', city: 'Paris' });
  });

  it('returns an empty object if all fields are empty', () => {
    const input = { a: '', b: '', c: '' };
    const result = cleanPayload(input);
    expect(result).toEqual({});
  });

  it('does not remove null or undefined values', () => {
    const input = { a: null, b: undefined, c: '' };
    const result = cleanPayload(input);
    expect(result).toEqual({});
  });
});
