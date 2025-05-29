// frontend/src/validations/signupSchema.ts
import { z } from 'zod';

export const signupSchema = z.object({
  firstName: z.string().nonempty('Prénom requis'),
  lastName: z.string().nonempty('Nom requis'),
  username: z
    .string()
    .min(3, "Nom d'utilisateur trop court")
    .max(20, "Nom d'utilisateur trop long"),
  email: z.string().email('Email invalide'),
  password: z
    .string()
    .min(8, 'Le mot de passe doit faire au moins 8 caractères')
    .regex(/\d/, 'Doit contenir au moins un chiffre')
    .regex(/[a-zA-Z]/, 'Doit contenir des lettres')
    .regex(/[@$!%*?&]/, 'Doit contenir un caractère spécial'),
  phone: z.string().nonempty('Téléphone requis'),
  address: z.string().nonempty('Adresse requise'),
  avatar: z.string().url('URL invalide').optional().or(z.literal('')),
});
