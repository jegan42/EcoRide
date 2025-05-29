// frontend/src/validations/signinSchema.ts
import { z } from 'zod';

export const signinSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z
    .string()
    .min(8, 'Le mot de passe doit faire au moins 8 caractères'),
});
