// frontend/src/validations/preferencesSchema.ts
import { z } from 'zod';

export const preferencesSchema = z.object({
  acceptsSmoker: z.boolean(),
  acceptsPets: z.boolean(),
  acceptsMusic: z.boolean(),
  acceptsChatter: z.boolean(),
});

export type PreferencesFormData = z.infer<typeof preferencesSchema>;
