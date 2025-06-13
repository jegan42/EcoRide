// frontend/src/validations/tripSchema.ts
import { z } from 'zod';
import type { Trip, TripStatus } from '../types/trip';

export const tripStatusValue = ['open', 'full', 'cancelled'] as const;

export const tripStatusEnum = z.enum(tripStatusValue, {
  errorMap: () => ({ message: 'Statut de trajet invalide' }),
});

export const tripSchemaBase = z
  .object({
    id: z.string().optional(),

    driverId: z.string().nonempty({ message: 'Chauffeur invalide' }),
    vehicleId: z.string().nonempty({ message: 'Véhicule invalide' }),

    departureCity: z
      .string()
      .min(2, 'Ville de départ invalide')
      .max(100, 'Ville de départ trop longue'),

    arrivalCity: z
      .string()
      .min(2, 'Ville d’arrivée invalide')
      .max(100, 'Ville d’arrivée trop longue'),

    departureDate: z
      .string()
      .refine((date) => !isNaN(Date.parse(date)), 'Date de départ invalide'),

    arrivalDate: z
      .string()
      .refine((date) => !isNaN(Date.parse(date)), 'Date d’arrivée invalide'),

    availableSeats: z.string().refine((val) => {
      const n = Number(val);
      return Number.isInteger(n) && n > 0 && n <= 10;
    }, 'Nombre de places disponible invalide'),

    price: z.string().refine((val) => {
      const n = Number(val);
      return !isNaN(n) && n >= 0;
    }, 'Prix invalide'),

    status: tripStatusEnum.optional(),
  })
  .superRefine((data, ctx) => {
    const departure = new Date(data.departureDate);
    const arrival = new Date(data.arrivalDate);

    if (arrival <= departure) {
      ctx.addIssue({
        path: ['arrivalDate'],
        code: z.ZodIssueCode.custom,
        message: 'La date d’arrivée doit être après la date de départ',
      });
    }
  });

export type TripFormData = z.infer<typeof tripSchemaBase>;

export type TripFormOutput = Partial<Trip>;

export const parseTripForm = (data: TripFormData): TripFormOutput => ({
  ...data,
  departureDate: data.departureDate,
  arrivalDate: data.arrivalDate,
  availableSeats: Number(data.availableSeats),
  price: Number(data.price),
  status: data.status as TripStatus,
});

export const statusOptions = [
  { value: 'open', label: 'Ouvert' },
  { value: 'full', label: 'Complet' },
  { value: 'cancelled', label: 'Annulé' },
];
