// frontend/src/forms/SigninForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signinSchema } from '../validations/signinSchema';
import type { z } from 'zod';
import { Box, Button, TextField } from '@mui/material';
import type { JSX } from 'react';

export type SigninFormData = z.infer<typeof signinSchema>;

interface Props {
  onSubmit: (data: SigninFormData) => void;
}

const SigninForm = ({ onSubmit }: Props): JSX.Element => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninFormData>({
    resolver: zodResolver(signinSchema),
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <TextField
        label="Email"
        {...register('email')}
        error={!!errors.email}
        helperText={errors.email?.message}
        size="small"
        type="email"
        fullWidth
        margin="normal"
      />
      <TextField
        label="Mot de passe"
        {...register('password')}
        error={!!errors.password}
        helperText={errors.password?.message}
        size="small"
        type="password"
        fullWidth
        margin="normal"
      />
      <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
        Se connecter
      </Button>
    </Box>
  );
};

export default SigninForm;
