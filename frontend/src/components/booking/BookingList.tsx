// frontend/src/components/booking/BookingList.tsx
import { Box, CircularProgress, Typography } from '@mui/material';
import { useBookings } from '../../hooks/useBookings';
import { BookingCard } from './BookingCard';
import { useEffect, useState, type JSX } from 'react';
import { SwitchButton } from '../switchbutton/SwitchButton';
import { useIsDriver } from '../../hooks/useIsDriver';
import type { Booking } from '../../types/booking';
import { useBookingFilters } from '../../hooks/useBookingFilters';
import { BookingFilters } from './BookingFilters';
import { BookingSort } from './BookingSort';

export const BookingList = (): JSX.Element => {
  const isDriver = useIsDriver();
  const { bookings, driverBookings, loading, refetchAll } = useBookings();
  const [isDriverBookings, setIsDriverBookings] = useState(false);
  const [onUpdate, setOnUpdate] = useState(false);

  useEffect(() => {
    if (onUpdate === true) {
      const refresh = async (): Promise<void> => {
        await refetchAll();
        setOnUpdate(false);
      };
      void refresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onUpdate]);

  const safeBookings = (isDriverBookings ? driverBookings : bookings).filter(
    (v): v is Booking => !!v?.id
  );

  const {
    filteredBookings,
    statusFilter,
    sortKey,
    sortOrder,
    setStatusFilter,
    setSortKey,
    setSortOrder,
    resetFilters,
  } = useBookingFilters(safeBookings);

  if (loading) {
    return (
      <Box textAlign="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (!bookings.length && !driverBookings.length) {
    return (
      <Typography variant="h6" textAlign="center" mt={5}>
        Vous n’avez aucune réservation pour le moment.
      </Typography>
    );
  }

  return (
    <Box mt={2}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          gap: 2,
          mt: 3,
        }}
      >
        <BookingFilters
          bookings={filteredBookings}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          resetFilters={resetFilters}
        />
        <BookingSort
          sortKey={sortKey}
          sortOrder={sortOrder}
          setSortKey={setSortKey}
          setSortOrder={setSortOrder}
        />
      </Box>
      {isDriver && (
        <SwitchButton
          checked={isDriverBookings}
          onChange={setIsDriverBookings}
          switchOn="Chauffeur"
          switchOff="Passager"
        />
      )}
      <Box display="flex" flexDirection="column" gap={2} mt={2}>
        {filteredBookings.map((booking) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            isDriverBookings={isDriverBookings}
            setOnUpdate={setOnUpdate}
            onValidate={refetchAll}
          />
        ))}
      </Box>
    </Box>
  );
};
