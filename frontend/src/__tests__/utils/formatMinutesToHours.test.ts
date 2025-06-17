// frontend/src/__tests__/utils/formatMinutesToHours.test.ts
import { describe, expect, it } from 'vitest';
import { formatMinutesToHours } from '../../utils/formatMinutesToHours';

describe('formatMinutesToHours', () => {
  it('return 10 min', () => {
    const minutes = 10;
    const result = formatMinutesToHours(minutes);

    expect(result).toMatch('10 min');
  });

  it('return 1 h 6 min', () => {
    const result = formatMinutesToHours(66);
    expect(result).toBe('1 h 6 min');
  });

  it('return nothing', () => {
    const result = formatMinutesToHours(-1);
    expect(result).toBe('');
  });
});
