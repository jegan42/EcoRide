// backend/src/services/userPreferences.service.ts
import prismaNewClient from '../lib/prisma';
import { UserPreferences } from '../../generated/prisma';

const UserPreferencesFields = [
  'acceptsSmoker',
  'acceptsPets',
  'acceptsMusic',
  'acceptsChatter',
];

const booleanValues = ['true', 'false'];

export class PreferenceService {
  static isCreateInputValid(data: Partial<UserPreferences>): boolean {
    return UserPreferencesFields.every(
      (field) =>
        field in data &&
        (typeof data[field as keyof UserPreferences] === 'boolean' ||
          (typeof data[field as keyof UserPreferences] === 'string' &&
            booleanValues.includes(
              data[field as keyof UserPreferences] as string
            )))
    );
  }

  static isUpdateInputValid(data: Partial<UserPreferences>): boolean {
    return (
      Object.keys(data).length > 0 &&
      Object.entries(data).every(
        ([key, value]) =>
          UserPreferencesFields.includes(key) && typeof value === 'boolean'
      )
    );
  }

  static async isExistUserPreferences(id: string): Promise<boolean> {
    return Boolean(
      await prismaNewClient.userPreferences.findUnique({
        where: { userId: id },
      })
    );
  }
}
