// frontend/src/validations/profilSchema.ts
import { z } from 'zod';

export const profileSchema = z.object({
  id: z.string().optional(),
  firstName: z.string().nonempty('Prénom requis').optional().or(z.literal('')),
  lastName: z.string().nonempty('Nom requis').optional().or(z.literal('')),
  phone: z.string().nonempty('Téléphone requis').optional().or(z.literal('')),
  address: z.string().nonempty('Adresse requise').optional().or(z.literal('')),
  avatar: z.string().url('URL invalide').optional().or(z.literal('')),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
