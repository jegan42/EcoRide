// frontend/src/pages/profile/ProfileForm.tsx
import React, { type JSX } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, TextField, Button } from '@mui/material';
import type { User } from '../../types/user';
import type z from 'zod';
import { profileSchema } from '../../validations/profileSchema';

export type ProfileFormData = z.infer<typeof profileSchema>;

interface Props {
  user: Partial<User> | null;
  isSubmitting: boolean;
  onSubmit: (data: ProfileFormData) => void;
  onCancel: () => void;
}

const profileFields = {
  firstName: 'Prénom',
  lastName: 'Nom',
  phone: 'Téléphone',
  address: 'Adresse',
  avatar: 'Avatar (URL)',
};

const ProfileForm: React.FC<Props> = ({
  user,
  isSubmitting,
  onSubmit,
  onCancel,
}): JSX.Element => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      id: user?.id,
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
      address: user?.address || '',
      avatar: user?.avatar || '',
    },
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      {Object.entries(profileFields).map(([key, value]) => {
        return (
          <TextField
            key={key}
            label={value}
            type="text"
            {...register(key as keyof ProfileFormData)}
            error={!!errors[key as keyof ProfileFormData]}
            helperText={errors[key as keyof ProfileFormData]?.message}
            size="small"
            fullWidth
            margin="dense"
          />
        );
      })}
      <Box display="flex" justifyContent="space-between" mt={2}>
        <Button variant="outlined" onClick={onCancel}>
          Annuler
        </Button>
        <Button variant="contained" type="submit" disabled={isSubmitting}>
          Sauvegarder
        </Button>
      </Box>
    </Box>
  );
};

export default ProfileForm;
