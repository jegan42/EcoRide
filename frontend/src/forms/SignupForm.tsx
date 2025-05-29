// src/forms/SignupForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema } from '../validations/signupSchema';
import type { z } from 'zod';
import { Box, Button, TextField } from '@mui/material';
import type { JSX } from 'react';

export type SignupFormData = z.infer<typeof signupSchema>;

interface Props {
  onSubmit: (data: SignupFormData) => void;
}

const signupFields = {
  firstName: 'Prénom',
  lastName: 'Nom',
  username: "Nom d'utilisateur",
  email: 'Email',
  password: 'Mot de passe',
  phone: 'Téléphone',
  address: 'Adresse',
  avatar: 'Avatar (URL)',
};

const SignupForm = ({ onSubmit }: Props): JSX.Element => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      {Object.entries(signupFields).map(([key, value]) => (
        <TextField
          key={key}
          label={value}
          {...register(key as keyof SignupFormData)}
          error={!!errors[key as keyof SignupFormData]}
          helperText={errors[key as keyof SignupFormData]?.message}
          size="small"
          fullWidth
          margin="dense"
        />
      ))}
      <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
        S’inscrire
      </Button>
    </Box>
  );
};

export default SignupForm;
