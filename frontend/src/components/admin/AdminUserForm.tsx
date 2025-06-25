// frontend/src/components/admin/AdminUserForm.tsx
import React, { useEffect } from 'react';
import {
  Box,
  MenuItem,
  TextField,
  Select,
  InputLabel,
  FormControl,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Stack,
} from '@mui/material';
import { useForm, Controller, useWatch } from 'react-hook-form';
import type { RoleEnum, User } from '../../types/user';

interface Props {
  user: User;
  onSave: (updated: Partial<User>) => void;
}

const availableRoles: RoleEnum[] = [
  'passenger',
  'driver',
  'employee',
  'suspended',
];

export const AdminUserForm: React.FC<Props> = ({ user, onSave }) => {
  const { register, control } = useForm<Partial<User>>({
    defaultValues: {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      address: user.address,
      credits: user.credits,
      role: user.role ?? [],
    },
  });

  const watchedValues = useWatch({ control });

  useEffect(() => {
    onSave({
      ...user,
      ...watchedValues,
      averageRating: undefined,
    });
  }, [watchedValues, onSave, user]);

  return (
    <Box component="form" sx={{ mt: 2 }}>
      <Stack spacing={2}>
        <TextField label="Prénom" {...register('firstName')} fullWidth />
        <TextField label="Nom" {...register('lastName')} fullWidth />
        <TextField label="Téléphone" {...register('phone')} fullWidth />
        <TextField label="Adresse" {...register('address')} fullWidth />
        <TextField
          label="Crédits"
          type="number"
          {...register('credits', { valueAsNumber: true })}
          fullWidth
        />

        <FormControl fullWidth>
          <InputLabel>Rôles</InputLabel>
          <Controller
            control={control}
            name="role"
            render={({ field }) => (
              <Select
                multiple
                {...field}
                input={<OutlinedInput label="Rôles" />}
                renderValue={(selected) => (selected as string[]).join(', ')}
              >
                {availableRoles.map((role) => (
                  <MenuItem key={role} value={role}>
                    <Checkbox checked={field.value?.includes(role) ?? false} />
                    <ListItemText primary={role} />
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </FormControl>
      </Stack>
    </Box>
  );
};
