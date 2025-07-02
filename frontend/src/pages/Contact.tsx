// frontend/src/pages/Contact.tsx
import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { addContact } from '../services/contactsService';
import emailService from '../services/emailService';
import {
  enqueueSnackbarSuccess,
  enqueueSnackbarError,
} from '../utils/enqueueSnackbar';
import type { Contact as ContactFormData } from '../types/contact';
import { ContactForm } from '../components/contact/ContactForm';

export const Contact: React.FC = () => {
  const navigate = useNavigate();

  const handleContactSubmit = (data: ContactFormData): void => {
    const contactSubmit = async (): Promise<void> => {
      try {
        const { id: _, ...dataToSet } = data;
        const result = await addContact({ ...dataToSet, status: 'unread' });

        await emailService.sendMail({
          subject: `${dataToSet.email} : ${dataToSet.subject}`,
          html: dataToSet.message,
        });

        if (result.data) {
          enqueueSnackbarSuccess('Votre message a bien été envoyé !');
          void navigate('/');
        } else {
          enqueueSnackbarError(new Error("Erreur lors de l'envoi"));
        }
      } catch (error) {
        enqueueSnackbarError(error);
      }
    };
    void contactSubmit();
  };
  return (
    <Box component="main" sx={{ py: 6 }}>
      <Container maxWidth="sm">
        <Typography variant="h4" gutterBottom textAlign="center">
          Contactez-nous
        </Typography>
        <ContactForm onSubmit={handleContactSubmit} />
      </Container>
    </Box>
  );
};
