// frontend/src/validations/vehicleSchema.ts
import { z } from 'zod';
import {
  vehicleEnergyEnum,
  type Vehicle,
  type VehicleEnergy,
} from '../types/vehicle';

const CURRENT_YEAR = new Date().getFullYear();

export const vehicleSchema = z
  .object({
    id: z.string().optional(),
    brand: z.string().nonempty('La marque est requise'),
    model: z.string().nonempty('Le modèle est requis'),
    color: z.string().nonempty('La couleur est requise'),
    vehicleYear: z.string().nonempty("L'année est requise"),
    licensePlate: z
      .string()
      .toUpperCase()
      .min(3)
      .max(20)
      .refine(
        (val) => /^[A-Z0-9-]+$/.test(val),
        'Caractères autorisés : lettres, chiffres, tirets'
      ),
    energy: z.enum(vehicleEnergyEnum, {
      errorMap: () => ({ message: "Le type d'énergie est invalide" }),
    }),
    seatCount: z.string().nonempty('Le nombre de places est requis'),
    photo: z
      .union([z.string().url('URL invalide'), z.literal(''), z.undefined()])
      .optional(),
  })
  .superRefine((data, ctx) => {
    const year = Number(data.vehicleYear);
    if (isNaN(year) || !Number.isInteger(year)) {
      ctx.addIssue({
        path: ['vehicleYear'],
        code: z.ZodIssueCode.custom,
        message: "L'année doit être un nombre entier",
      });
    } else if (year < 1900 || year > CURRENT_YEAR + 1) {
      ctx.addIssue({
        path: ['vehicleYear'],
        code: z.ZodIssueCode.custom,
        message: "L'année est invalide",
      });
    }

    const seats = Number(data.seatCount);
    if (isNaN(seats) || !Number.isInteger(seats)) {
      ctx.addIssue({
        path: ['seatCount'],
        code: z.ZodIssueCode.custom,
        message: 'Le nombre de places doit être un entier',
      });
    } else if (seats < 1 || seats > 10) {
      ctx.addIssue({
        path: ['seatCount'],
        code: z.ZodIssueCode.custom,
        message: 'Le nombre de places doit être entre 1 et 10',
      });
    }
  });

export type VehicleFormData = z.infer<typeof vehicleSchema>;

export const vehicleUpdateSchema = z.object({
  id: z.string().optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  color: z.string().optional(),
  vehicleYear: z.string().optional(),
  licensePlate: z.string().optional(),
  energy: z.string().optional(),
  seatCount: z.string().optional(),
  photo: z.string().url().optional().or(z.literal('')),
});

export type VehicleFormOutput = Partial<Vehicle>;

export const parseVehicleForm = (data: VehicleFormData): VehicleFormOutput => ({
  ...data,
  energy: data.energy as VehicleEnergy,
  vehicleYear: Number(data.vehicleYear),
  seatCount: Number(data.seatCount),
  photo: data.photo?.trim() === '' ? undefined : data.photo,
});
