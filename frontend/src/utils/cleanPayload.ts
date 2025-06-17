// frontend/src/utils/cleanPayload.ts
const keysToLowercase = [
  'departureCity',
  'arrivalCity',
  'brand',
  'model',
  'color',
] as const;

export const cleanPayload = <T extends Record<string, unknown>>(
  payload: T
): Partial<T> => {
  const cleaned: Partial<T> = {};
  for (const key in payload) {
    const value = payload[key];
    if (value !== '' && value !== undefined && value !== null) {
      if (
        typeof value === 'string' &&
        (keysToLowercase as readonly string[]).includes(key)
      ) {
        cleaned[key] = value.toLowerCase() as T[typeof key];
      } else {
        cleaned[key] = value;
      }
    }
  }
  return cleaned;
};
