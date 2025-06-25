// frontend/src/component/admin/AdminTripForm.tsx
import React, { useEffect, useState, type JSX } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import {
  TextField,
  Box,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Typography,
} from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  type TripFormData,
  type TripFormOutput,
  parseTripForm,
  statusOptions,
  tripSchemaBase,
} from '../../validations/tripSchema';

import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { fr } from 'date-fns/locale/fr';
import type { Vehicle } from '../../types/vehicle';
import vehicleService from '../../services/vehicleService';
import {
  enqueueSnackbarSuccess,
  enqueueSnackbarError,
} from '../../utils/enqueueSnackbar';

interface AdminTripFormProps {
  defaultValues: TripFormOutput | null;
  onSubmit: (data: TripFormOutput) => void;
}

export const AdminTripForm: React.FC<AdminTripFormProps> = ({
  defaultValues,
  onSubmit,
}) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicles = async (): Promise<void> => {
      setLoading(true);

      if (!defaultValues?.driverId) return;
      try {
        const { data, message } = await vehicleService.fetchVehicleByUserId(
          defaultValues.driverId
        );
        setVehicles(data);
        enqueueSnackbarSuccess(message);
      } catch (error) {
        enqueueSnackbarError(error);
        setError('Erreur lors du chargement des vehicules');
      } finally {
        setLoading(false);
      }
    };

    void fetchVehicles();
  }, [defaultValues?.driverId]);
  const safeVehicles = vehicles.filter((v): v is Vehicle => v !== undefined);

  const [maxSeats, setMaxSeats] = useState(9);
  const defaultDate = new Date();

  const defaultDateAdd1h = new Date(defaultDate);
  defaultDateAdd1h.setHours(defaultDateAdd1h.getHours() + 1);

  const defaultDateAdd2h = new Date(defaultDate);
  defaultDateAdd2h.setHours(defaultDateAdd2h.getHours() + 2);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TripFormData>({
    resolver: zodResolver(tripSchemaBase),
    defaultValues: {
      ...defaultValues,
      driverId: defaultValues?.driverId,
      departureDate:
        defaultValues?.departureDate ?? defaultDateAdd1h.toISOString(),
      arrivalDate: defaultValues?.arrivalDate ?? defaultDateAdd2h.toISOString(),
      availableSeats: defaultValues?.availableSeats?.toString() ?? '',
      price: defaultValues?.price?.toString() ?? '',
      status: defaultValues?.status,
    },
  });

  const watchedValues = useWatch({ control });

  useEffect(() => {
    onSubmit({
      ...defaultValues,
      ...watchedValues,
      availableSeats: watchedValues.availableSeats
        ? Number(watchedValues.availableSeats)
        : undefined,
      price: watchedValues.price ? Number(watchedValues.price) : undefined,
    });
  }, [watchedValues, onSubmit, defaultValues]);

  const handleVehicleChange = (
    vehicleId: string,
    vehicles: Vehicle[] = [],
    onChange: (val: string) => void,
    setMaxSeats: (count: number) => void
  ): void => {
    onChange(vehicleId);
    const selectedVehicle = vehicles.find((v) => v?.id === vehicleId);
    setMaxSeats(Number(selectedVehicle?.seatCount));
  };

  const onSubmitHandler = (data: TripFormData): void => {
    const cleanedData = parseTripForm(data);
    onSubmit(cleanedData);
  };

  const FormDateTimePicker = ({
    label,
    value,
    onChange,
    error,
    helperText,
    inputTestId,
  }: {
    label: string;
    value: string | null;
    onChange: (value: string) => void;
    error: boolean;
    helperText?: string;
    inputTestId?: string;
  }): JSX.Element => {
    return (
      <DateTimePicker
        label={label}
        value={value ? new Date(value) : null}
        onChange={(date) => onChange(date?.toISOString() || '')}
        slotProps={{
          textField: {
            fullWidth: true,
            size: 'small',
            variant: 'outlined',
            margin: 'dense',
            error,
            helperText,
            inputProps: {
              'data-testid': inputTestId,
            },
          },
        }}
      />
    );
  };

  const isPassedTrip = defaultValues?.departureDate
    ? new Date(defaultValues.departureDate) < new Date()
    : false;

  if (loading || error) {
    <Typography>{loading ? 'Chargement...' : error}</Typography>;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmitHandler)}
        noValidate
        sx={{
          width: '100%',
        }}
      >
        <FormControl
          fullWidth
          margin="dense"
          size="small"
          error={!!errors.vehicleId}
        >
          <InputLabel id="vehicle-label">Véhicule</InputLabel>
          <Controller
            name="vehicleId"
            control={control}
            render={({ field }) => (
              <Select
                labelId="vehicle-label"
                label="Véhicule"
                {...field}
                value={field.value || ''}
                onChange={(event) =>
                  handleVehicleChange(
                    event.target.value,
                    safeVehicles,
                    field.onChange,
                    setMaxSeats
                  )
                }
              >
                {safeVehicles.map((vehicle) => (
                  <MenuItem key={vehicle?.id} value={vehicle?.id}>
                    {`${vehicle?.brand} ${vehicle?.model} - ${vehicle?.licensePlate}`}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          {errors.vehicleId && (
            <FormHelperText>{errors.vehicleId.message}</FormHelperText>
          )}
        </FormControl>
        <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
          <TextField
            label="Ville de départ"
            fullWidth
            margin="dense"
            size="small"
            variant="outlined"
            {...register('departureCity')}
            error={!!errors.departureCity}
            helperText={errors.departureCity?.message}
          />

          <Controller
            name="departureDate"
            control={control}
            render={({ field }) => (
              <FormDateTimePicker
                label="Date et heure de départ"
                value={field.value}
                onChange={field.onChange}
                error={!!errors.departureDate}
                helperText={errors.departureDate?.message}
                inputTestId="departure-date-input"
              />
            )}
          />
        </Box>
        <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
          <TextField
            label="Ville d’arrivée"
            fullWidth
            margin="dense"
            size="small"
            variant="outlined"
            {...register('arrivalCity')}
            error={!!errors.arrivalCity}
            helperText={errors.arrivalCity?.message}
          />

          <Controller
            name="arrivalDate"
            control={control}
            render={({ field }) => (
              <FormDateTimePicker
                label="Date et heure d’arrivée"
                value={field.value}
                onChange={field.onChange}
                error={!!errors.arrivalDate}
                helperText={errors.arrivalDate?.message}
                inputTestId="arrival-date-input"
              />
            )}
          />
        </Box>
        <TextField
          label={`Places disponibles (max. ${maxSeats - 1})`}
          fullWidth
          margin="dense"
          size="small"
          type="number"
          slotProps={{
            input: {
              inputProps: {
                min: 1,
                max: maxSeats - 1,
              },
            },
          }}
          {...register('availableSeats')}
          error={!!errors.availableSeats}
          helperText={errors.availableSeats?.message}
        />
        <TextField
          label="Prix (€)"
          fullWidth
          margin="dense"
          size="small"
          type="number"
          {...register('price')}
          error={!!errors.price}
          helperText={errors.price?.message}
        />

        {!isPassedTrip && (
          <FormControl
            fullWidth
            margin="dense"
            size="small"
            error={!!errors.status}
          >
            <InputLabel id="status-label">Statut</InputLabel>
            <Controller
              name="status"
              control={control}
              defaultValue="open"
              render={({ field }) => (
                <Select labelId="status-label" label="Statut" {...field}>
                  {/* <MenuItem value="open">Ouvert</MenuItem> */}
                  {statusOptions.map(({ value, label }) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.status && (
              <FormHelperText>{errors.status.message}</FormHelperText>
            )}
          </FormControl>
        )}
      </Box>
    </LocalizationProvider>
  );
};
