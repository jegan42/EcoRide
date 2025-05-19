// backend/src/utils/validation.ts
export const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const isId = (id: string): boolean => {
  return Boolean(id && UUID_REGEX.test(id));
};
