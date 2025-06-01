// frontend/src/utils/cleanPayload.ts
export const cleanPayload = <T extends Record<string, unknown>>(
  payload: T
): Partial<T> => {
  const cleaned: Partial<T> = {};
  for (const key in payload) {
    if (payload[key] !== '') {
      cleaned[key] = payload[key];
    }
  }
  return cleaned;
};
