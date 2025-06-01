// frontend/src/forms/SignupForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema } from '../validations/signupSchema';
import type { z } from 'zod';
import { Box, Button, TextField } from '@mui/material';
import type { JSX } from 'react';

import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

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
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordToggle = (): void => {
    setShowPassword(true);
    setTimeout(() => setShowPassword(false), 1000);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      {Object.entries(signupFields).map(([key, value]) => {
        const isPassword = key === 'password';
        return (
          <TextField
            key={key}
            label={value}
            type={isPassword && !showPassword ? 'password' : 'text'}
            {...register(key as keyof SignupFormData)}
            error={!!errors[key as keyof SignupFormData]}
            helperText={errors[key as keyof SignupFormData]?.message}
            size="small"
            fullWidth
            margin="dense"
            slotProps={
              isPassword
                ? {
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handlePasswordToggle}
                            edge="end"
                            aria-label="Afficher le secret"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }
                : undefined
            }
          />
        );
      })}
      <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
        S’inscrire
      </Button>
    </Box>
  );
};

export default SignupForm;
