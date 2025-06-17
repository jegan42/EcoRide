// frontend/src/hooks/useFindTripSearch.ts
import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';

export const useFindTripSearch = (
  fetchTrips: (
    data: Partial<{
      departureCity: string;
      arrivalCity: string;
      departureDate: string;
      flexible: boolean;
    }>
  ) => Promise<boolean>
): {
  departureCity: string;
  arrivalCity: string;
  date: Date | null;
  flexible: boolean;
  setDepartureCity: Dispatch<SetStateAction<string>>;
  setArrivalCity: Dispatch<SetStateAction<string>>;
  setDate: Dispatch<SetStateAction<Date | null>>;
  setFlexible: Dispatch<SetStateAction<boolean>>;
  handleSearch: () => Promise<void>;
  handleReset: () => void;
} => {
  const [departureCity, setDepartureCity] = useState('');
  const [arrivalCity, setArrivalCity] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [flexible, setFlexible] = useState(false);

  useEffect(() => {
    void fetchTrips({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async (): Promise<void> => {
    const query = {
      ...(departureCity && { departureCity }),
      ...(arrivalCity && { arrivalCity }),
      ...(date && { departureDate: date.toISOString() }),
      ...(flexible && { flexible }),
    };
    await fetchTrips(query);
  };

  const handleReset = async (): Promise<void> => {
    setDepartureCity('');
    setArrivalCity('');
    setDate(null);
    setFlexible(false);
    await fetchTrips({});
  };

  return {
    departureCity,
    arrivalCity,
    date,
    flexible,
    setDepartureCity,
    setArrivalCity,
    setDate,
    setFlexible,
    handleSearch,
    handleReset,
  };
};
