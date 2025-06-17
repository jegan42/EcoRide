// frontend/src/__tests__/utils/getFuelEcoGroup.test.ts
import { describe, expect, it } from 'vitest';
import { getFuelEcoGroup } from '../../utils/getFuelEcoGroup';

describe('getFuelEcoGroup', () => {
  it('return unknown', () => {
    const result = getFuelEcoGroup(undefined);
    expect(result).toMatch('unknown');
  });

  it('return unknown', () => {
    const result = getFuelEcoGroup('undefined');
    expect(result).toMatch('unknown');
  });

  it('return notEco', () => {
    const result = getFuelEcoGroup('diesel');
    expect(result).toBe('notEco');
  });

  it('return eco', () => {
    const result = getFuelEcoGroup('electric');
    expect(result).toBe('eco');
  });
});
