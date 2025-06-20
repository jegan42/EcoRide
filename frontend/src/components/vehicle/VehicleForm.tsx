// frontend/src/component/vehicle/VehicleForm.tsx
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import {
  parseVehicleForm,
  vehicleSchema,
  type VehicleFormData,
  type VehicleFormOutput,
} from '../../validations/vehicleSchema';
import { energyOptions, type Vehicle } from '../../types/vehicle';

interface VehicleFormProps {
  defaultValues?: Vehicle | null;
  isSubmitting: boolean;
  onSubmit: (data: VehicleFormOutput) => void;
  onCancel: () => void;
}

const vehicleFields: Record<keyof VehicleFormOutput, string> = {
  brand: 'Marque',
  model: 'Modèle',
  color: 'Couleur',
  vehicleYear: 'Année du véhicule',
  licensePlate: 'Plaque d’immatriculation',
  energy: 'Énergie',
  seatCount: 'Nombre de places',
  photo: 'Photo (URL)',
  id: '',
  userId: '',
  createdAt: '',
  updatedAt: '',
};

export const VehicleForm: React.FC<VehicleFormProps> = ({
  defaultValues,
  isSubmitting,
  onSubmit,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      ...defaultValues,
      id: defaultValues?.id,
      vehicleYear: String(defaultValues?.vehicleYear),
      seatCount: String(defaultValues?.seatCount),
    },
  });

  const onSubmitHandler = (data: VehicleFormData): void => {
    const cleanedData = parseVehicleForm(data);
    onSubmit(cleanedData);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmitHandler)}
      noValidate
      sx={{
        width: '100%',
      }}
    >
      {Object.entries(vehicleFields)
        .filter(([_key, label]) => label !== '')
        .map(([key, label]) =>
          key === 'energy' ? (
            <FormControl
              key={key}
              fullWidth
              margin="dense"
              size="small"
              error={!!errors.energy}
            >
              <InputLabel id="energy-label">{label}</InputLabel>
              <Controller
                name="energy"
                control={control}
                defaultValue={defaultValues?.energy ?? ''}
                render={({ field }) => (
                  <Select labelId="energy-label" label={label} {...field}>
                    {energyOptions.map(({ value, label }) => (
                      <MenuItem key={value} value={value}>
                        {label}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
          ) : (
            <TextField
              key={key}
              label={label}
              type={
                key === 'vehicleYear' || key === 'seatCount' ? 'number' : 'text'
              }
              {...register(key as keyof VehicleFormData)}
              error={!!errors[key as keyof VehicleFormData]}
              helperText={errors[key as keyof VehicleFormData]?.message}
              size="small"
              fullWidth
              margin="dense"
            />
          )
        )}
      <Box mt={2} display="flex" justifyContent="space-between">
        <Button variant="outlined" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          Sauvegarder
        </Button>
      </Box>
    </Box>
  );
};
