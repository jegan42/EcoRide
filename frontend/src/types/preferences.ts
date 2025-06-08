// frontend/src/types/preferences.ts
export interface UserPreferences {
  id: string;
  userId: string;
  acceptsSmoker: boolean;
  acceptsPets: boolean;
  acceptsMusic: boolean;
  acceptsChatter: boolean;
  createdAt: string;
  updatedAt: string;
}

export const preferencesLabel: {
  value: keyof Partial<UserPreferences>;
  label: string;
}[] = [
  { value: 'acceptsSmoker', label: 'Accepte les fumeurs' },
  { value: 'acceptsPets', label: 'Accepte les animaux' },
  { value: 'acceptsMusic', label: 'Accepte la musique' },
  { value: 'acceptsChatter', label: 'Accepte la conversation' },
];
