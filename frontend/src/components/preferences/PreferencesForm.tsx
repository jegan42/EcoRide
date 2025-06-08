// frontend/src/component/preferences/PreferencesForm.tsx
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Checkbox, FormControlLabel } from '@mui/material';
import {
  preferencesSchema,
  type PreferencesFormData,
} from '../../validations/preferencesSchema';
import { preferencesLabel } from '../../types/preferences';

interface PreferencesFormProps {
  defaultValues?: Partial<PreferencesFormData> | null;
  isSubmitting: boolean;
  onSubmit: (data: PreferencesFormData) => void;
  onCancel: () => void;
}

export const PreferencesForm: React.FC<PreferencesFormProps> = ({
  defaultValues,
  isSubmitting,
  onSubmit,
  onCancel,
}) => {
  const { control, handleSubmit } = useForm<PreferencesFormData>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      acceptsSmoker: defaultValues?.acceptsSmoker ?? false,
      acceptsPets: defaultValues?.acceptsPets ?? false,
      acceptsMusic: defaultValues?.acceptsMusic ?? false,
      acceptsChatter: defaultValues?.acceptsChatter ?? false,
    },
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' },
          gap: 1,
        }}
      >
        {preferencesLabel.map(({ value: field, label }) => (
          <Controller
            key={`${field}-${label}`}
            name={field as keyof PreferencesFormData}
            control={control}
            render={({ field: controllerField }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    {...controllerField}
                    checked={controllerField.value}
                    name={field}
                  />
                }
                label={label}
              />
            )}
          />
        ))}
      </Box>

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
