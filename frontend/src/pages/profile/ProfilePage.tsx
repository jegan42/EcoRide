// frontend/src/pages/Profile/ProfilePage.tsx
import React, { useEffect, useState } from 'react';
import { Avatar, Box, Container, Paper, Typography } from '@mui/material';
import userService from '../../services/userService';
import type { User } from '../../types/user';
import {
  enqueueSnackbarError,
  enqueueSnackbarSuccess,
} from '../../utils/enqueueSnackbar';
import ProfileLoading from './ProfileLoading';
import ProfileForm, { type ProfileFormData } from './ProfilForm';
import ProfileView from './ProfileView';
import { useDispatch } from 'react-redux';
import { signin as signinAction } from '../../store/slices/authSlice';

const ProfilePage: React.FC = () => {
  const dispatch = useDispatch();
  const [user, setUser] = useState<Partial<User> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProfile = async (): Promise<void> => {
      try {
        const { message, data: user } = await userService.fetchUser();
        setUser(user);
        enqueueSnackbarSuccess(message);
      } catch (error) {
        enqueueSnackbarError(error);
        setError('Erreur lors du chargement du profil');
      } finally {
        setLoading(false);
      }
    };
    void fetchProfile();
  }, []);

  const onSubmit = async (data: ProfileFormData): Promise<void> => {
    if (!user?.id) {
      enqueueSnackbarError("L'utilisateur est invalide.");
      return;
    }
    setIsSubmitting(true);
    try {
      const { message, data: user } = await userService.updateUser(data);
      dispatch(
        signinAction({
          user,
          isAuthenticated: true,
        })
      );
      setUser(user);
      enqueueSnackbarSuccess(message);
      setIsEditing(false);
    } catch (error) {
      enqueueSnackbarError(error);
      setError('Erreur lors de la mise à jour du profil');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Typography color="error" align="center">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        {loading ? (
          <ProfileLoading />
        ) : (
          <Box display="flex" flexDirection="column" alignItems="center">
            <Avatar
              src={user?.avatar ?? undefined}
              alt="Avatar"
              sx={{ width: 100, height: 100, mb: 2 }}
            />

            <Typography
              variant="h5"
              fontWeight="bold"
              sx={(theme) => ({
                color: theme.palette.primary.main,
              })}
              gutterBottom
            >
              {user?.username}
            </Typography>
            {isEditing ? (
              <ProfileForm
                user={user}
                isSubmitting={isSubmitting}
                onSubmit={onSubmit}
                onCancel={() => setIsEditing(false)}
              />
            ) : (
              <ProfileView
                user={user}
                setIsEditing={() => setIsEditing(true)}
              />
            )}
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ProfilePage;
