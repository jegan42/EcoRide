// frontend/src/__tests__/utils/formatField.test.ts
import { formatField } from '../../utils/formatField';

describe('formatField', () => {
  it('returns string version of value if defined and not empty', () => {
    expect(formatField(0)).toBe('0');
    expect(formatField(42)).toBe('42');
    expect(formatField('hello')).toBe('hello');
  });

  it('returns "—" if value is null, undefined, or empty string', () => {
    expect(formatField(null)).toBe('—');
    expect(formatField(undefined)).toBe('—');
    expect(formatField('')).toBe('—');
  });
});
