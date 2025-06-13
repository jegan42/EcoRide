// frontend/src/__tests__/utils/formatDateTime.test.ts
import { describe, expect, it } from 'vitest';
import { formatDateTime } from '../../utils/formatDateTime';

describe('formatDateTime', () => {
  it('formate correctement une date valide', () => {
    const date = new Date('2025-06-12T14:30:00Z');
    const result = formatDateTime(date);

    expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/);
  });

  it('retourne "—" si la date est undefined', () => {
    const result = formatDateTime(undefined);
    expect(result).toBe('—');
  });

  it('gère une chaîne de date ISO', () => {
    const result = formatDateTime('2025-06-12T10:15:00');
    expect(result).toBe('12/06/2025 10:15');
  });
});
