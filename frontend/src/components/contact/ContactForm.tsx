// frontend/src/components/contact/ContactForm.tsx
import React, { useEffect } from 'react';
import { Box, Button, TextField } from '@mui/material';
import { useForm, useWatch } from 'react-hook-form';
import type { Contact } from '../../types/contact';
import { useAppSelector } from '../../hooks/useAppSelector';

interface ContactFormProps {
  onSubmit: (data: Contact) => void;
  defaultData?: Partial<Contact>;
  showEmail?: boolean;
  autoSubmit?: boolean;
  showSubmitButton?: boolean;
}

export const ContactForm: React.FC<ContactFormProps> = ({
  onSubmit,
  defaultData = {},
  showEmail = true,
  autoSubmit = false,
  showSubmitButton = true,
}) => {
  const { user } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<Contact>({
    mode: 'onChange',
    defaultValues: {
      id: defaultData.id,
      email:
        (defaultData.email && `Re:${defaultData.email}`) ?? user?.email ?? '',
      subject: defaultData.subject ?? '',
      message: '',
    },
  });

  const watchedValues = useWatch({ control });

  useEffect(() => {
    if (user?.email) {
      reset((prev) => ({ ...prev, email: user.email }));
    }
  }, [user, reset]);

  useEffect(() => {
    if (autoSubmit) {
      onSubmit(watchedValues as Contact);
    }
  }, [watchedValues, autoSubmit, onSubmit]);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{ mt: 4 }}
    >
      {showEmail && (
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={watch('email')}
          {...register('email', {
            required: "L'email est requis",
            pattern: {
              value: /^\S+@\S+$/,
              message: "Format d'email invalide",
            },
          })}
          error={!!errors.email}
          helperText={errors.email?.message}
          slotProps={{
            input: {
              readOnly: !!user?.email,
            },
          }}
        />
      )}

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

      {showSubmitButton && (
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          disabled={!isValid || isSubmitting}
        >
          Envoyer
        </Button>
      )}
    </Box>
  );
};
