// frontend/src/pages/Contact.tsx
import React, { useEffect } from 'react';
import { Box, Button, Container, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { addContact } from '../services/contactsService';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/useAppSelector';
import {
  enqueueSnackbarSuccess,
  enqueueSnackbarError,
} from '../utils/enqueueSnackbar';

interface ContactFormData {
  email: string;
  subject: string;
  message: string;
}

export const Contact: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ContactFormData>({
    mode: 'onChange',
    defaultValues: {
      email: user?.email || '', // Prérempli si connecté
    }, // Active la validation en temps réel
  });

  useEffect(() => {
    if (user?.email) {
      // Met à jour le champ 'email' si le user est connecté
      reset((prev) => ({
        ...prev,
        email: user.email,
      }));
    }
  }, [user, reset]);

  const onSubmit = async (data: ContactFormData): Promise<void> => {
    try {
      const result = await addContact({
        ...data,
        status: 'unread',
      });

      if (result.data) {
        enqueueSnackbarSuccess('Votre message a bien été envoyé !');
        reset();
        void navigate('/');
      } else {
        enqueueSnackbarError(new Error("Erreur lors de l'envoi"));
      }
    } catch (error) {
      enqueueSnackbarError(error);
    }
  };

  return (
    <Box component="main" sx={{ py: 6 }}>
      <Container maxWidth="sm">
        <Typography variant="h4" gutterBottom textAlign="center">
          Contactez-nous
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ mt: 4 }}
        >
          <TextField
            label="Email"
            fullWidth
            value={watch('email')}
            margin="normal"
            {...register('email', {
              required: "L'email est requis",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Format d'email invalide",
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
            slotProps={{
              input: {
                inputProps: {
                  readOnly: !!user?.email,
                },
              },
            }}
          />

          <TextField
            label="Sujet"
            fullWidth
            margin="normal"
            {...register('subject', { required: 'Le sujet est requis' })}
            error={!!errors.subject}
            helperText={errors.subject?.message}
          />

          <TextField
            label="Message"
            fullWidth
            margin="normal"
            multiline
            rows={5}
            {...register('message', { required: 'Le message est requis' })}
            error={!!errors.message}
            helperText={errors.message?.message}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            disabled={!isValid || isSubmitting} // ⛔ Bouton désactivé si invalide ou en cours
          >
            Envoyer
          </Button>
        </Box>
      </Container>
    </Box>
  );
};
