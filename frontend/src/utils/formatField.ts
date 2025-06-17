// frontend/src/utils/formatField.ts

export const formatField = (value: unknown): string => {
  return value != null && value !== '' ? String(value) : '—';
};
