// frontend/src/utils/formatField.ts

export const formatField = (value: unknown): string => {
  return value != null && value !== '' && value != 'NaN' ? String(value) : '—';
};
