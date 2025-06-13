// frontend/src/utils/formatField.ts

export function formatField(value: unknown): string {
  return value != null && value !== '' ? String(value) : '—';
}
