// frontend/src/hooks/useAdmin.ts
import { useEffect, useMemo, useState } from 'react';
import {
  enqueueSnackbarSuccess,
  enqueueSnackbarError,
} from '../utils/enqueueSnackbar';
import type { RoleEnum, User } from '../types/user';
import userService from '../services/userService';
import type { Trip } from '../types/trip';
import tripService from '../services/tripService';
import type { Contact } from '../types/contact';
import { getAllContacts, updateContact } from '../services';
import {
  parseISO,
  format,
  isThisWeek,
  addDays,
  isSameDay,
  startOfWeek,
  eachDayOfInterval,
  endOfMonth,
  startOfMonth,
} from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  formatTimestampToDate,
  timestampToDate,
} from '../utils/formatDateTime';
import type { AdminFormMode } from '../types/admin';
import type { ChartDataType } from '../types/common';
import emailService from '../services/emailService';
import type { Booking } from '../types/booking';
import bookingService from '../services/bookingService';

export interface ChartData {
  tripsThisWeek: number;
  contactsThisWeek: number;
  commissionTotal: number;
  monthlyUsers: ChartDataType[];
  commissionThisMonthByDay: ChartDataType[];
  tripsThisWeekByDay: ChartDataType[];
  bookingsThisWeekByDay: ChartDataType[];
  bookingsThisMonthByDay: ChartDataType[];
  contactsThisWeekByDay: ChartDataType[];
  loginsThisWeekByDay: ChartDataType[];
  roleDistribution: ChartDataType[];
  simplifiedRoleDistribution: ChartDataType[];
  driverVsUsers: ChartDataType[];
}

export const useAdmin = (
  onConfirmed?: () => void
): {
  viewMode: AdminFormMode;
  setViewMode: React.Dispatch<React.SetStateAction<AdminFormMode>>;
  submitting: boolean;
  handleClose: () => void;
  handleConfirm: (viewMode: AdminFormMode, data: User | Trip | Contact) => void;
  selectedData: User | Trip | Contact | null;
  setSelectedData: React.Dispatch<
    React.SetStateAction<User | Trip | Contact | null>
  >;
  dataToUpdate: Partial<User> | Partial<Trip> | Partial<Contact> | null;
  setDataToUpdate: React.Dispatch<
    React.SetStateAction<
      Partial<User> | Partial<Trip> | Partial<Contact> | null
    >
  >;
  loading: boolean;
  allUsers: User[];
  allTrips: Trip[];
  allBookings: Booking[];
  allContacts: Contact[];
  chartDataToSet: ChartData;
} => {
  const [viewMode, setViewMode] = useState<AdminFormMode>('');
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allTrips, setAllTrips] = useState<Trip[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [allContacts, setAllContacts] = useState<Contact[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [selectedData, setSelectedData] = useState<
    User | Trip | Contact | null
  >(null);
  const [dataToUpdate, setDataToUpdate] = useState<
    Partial<User> | Partial<Trip> | Partial<Contact> | null
  >(null);

  const refreshData = (): void => {
    void fetchAllUsers();
    void fetchAllTrips();
    void fetchAllBookings(), void fetchAllContacts();
  };

  useEffect(() => {
    setLoading(true);
    void Promise.all([
      fetchAllUsers(),
      fetchAllTrips(),
      fetchAllBookings(),
      fetchAllContacts(),
    ]).finally(() => {
      setLoading(false);
    });
  }, []);

  const handleClose = (): void => {
    // console.log('viewMode', viewMode);
    const mode = viewMode.replace(/(Edit|Delete|Start|Arrived)$/, 'List');
    setSelectedData(null);
    setViewMode(mode as AdminFormMode);
  };

  const handleConfirm = async (): Promise<void> => {
    if (!dataToUpdate && !selectedData) {
      enqueueSnackbarError(new Error('Erreur, aucune donnée.'));
      return;
    }
    const handleData = dataToUpdate ?? selectedData;
    try {
      setSubmitting(true);
      const {
        createdAt: _createdAt,
        updatedAt: _updatedAt,
        ...dataSet
      } = handleData as Partial<User> | Partial<Trip> | Partial<Contact>;
      if (viewMode.includes('user')) {
        const {
          email: _email,
          username: _username,
          lastLogin: _lastLogin,
          ...updateUser
        } = dataSet as User;
        if (viewMode.includes('Edit')) {
          const { message } = await userService.updateUser(
            updateUser as Partial<User>
          );
          enqueueSnackbarSuccess(message);
        }
        if (viewMode.includes('Delete')) {
          updateUser.role.push('suspended');
          const { message } = await userService.updateUser({
            ...updateUser,
          } as Partial<User>);
          enqueueSnackbarSuccess(message);
        }
        refreshData();
      }
      if (viewMode.includes('trip')) {
        const {
          id: tripId,
          driver: _driver,
          vehicle: _vehicle,
          ...updateTrip
        } = dataSet as Trip;

        if (viewMode.includes('Edit')) {
          const { message } = await tripService.updateTrip(tripId, updateTrip);
          enqueueSnackbarSuccess(message);
        }
        if (viewMode.includes('Delete')) {
          const { message, data } = await tripService.updateTrip(tripId, {
            status: 'cancelled',
          });
          console.log('Delete', data);
          enqueueSnackbarSuccess(message);
        }
        if (viewMode.includes('Start')) {
          const { message, data } = await tripService.updateTrip(tripId, {
            status: 'start',
          });
          console.log('Start', data);
          enqueueSnackbarSuccess(message);
        }
        if (viewMode.includes('Arrived')) {
          const { message, data } = await tripService.updateTrip(tripId, {
            status: 'arrived',
          });
          console.log('Arrived', data);
          enqueueSnackbarSuccess(message);
        }
        refreshData();
      }
      if (viewMode.includes('contact')) {
        const { id: contactId, email, subject, message } = dataSet as Contact;
        console.log('dataSet', dataSet);
        if (!contactId) {
          enqueueSnackbarError(new Error('Erreur, aucune donnée.'));
          return;
        }
        if (viewMode.includes('Edit')) {
          const { message: responseMessage } = await updateContact(contactId, {
            status: 'answered',
          });

          enqueueSnackbarSuccess(responseMessage);
          await emailService.sendMail({
            to: email,
            subject,
            html: message,
          });
        }
        if (viewMode.includes('Delete')) {
          const { message } = await updateContact(contactId, {
            status: 'no-reply',
          });
          enqueueSnackbarSuccess(message);
        }
        refreshData();
      }
      handleClose();
      if (onConfirmed) onConfirmed();
    } catch (error) {
      enqueueSnackbarError(error);
    } finally {
      setSubmitting(false);
    }
  };

  const fetchAllUsers = async (): Promise<void> => {
    try {
      const { data } = await userService.fetchAllUsers();
      if (data) setAllUsers(data);
      enqueueSnackbarSuccess('fetchAllUsers success');
    } catch (error) {
      enqueueSnackbarError(error);
    }
  };

  const fetchAllTrips = async (): Promise<void> => {
    try {
      const { data } = await tripService.fetchAllTrips();
      if (data) setAllTrips(data);
      enqueueSnackbarSuccess('fetchAllUsers success');
    } catch (error) {
      enqueueSnackbarError(error);
    }
  };

  const fetchAllBookings = async (): Promise<void> => {
    try {
      const { data } = await bookingService.fetchAllBookings();
      if (data) setAllBookings(data);
      enqueueSnackbarSuccess('fetchAllBookings success');
    } catch (error) {
      enqueueSnackbarError(error);
    }
  };

  const fetchAllContacts = async (): Promise<void> => {
    try {
      const { data } = await getAllContacts();
      if (data) setAllContacts(data);
      enqueueSnackbarSuccess('fetchAllUsers success');
    } catch (error) {
      enqueueSnackbarError(error);
    }
  };

  const monthlyUsers = useMemo(() => {
    const counts: Record<string, number> = {};

    allUsers.forEach((user) => {
      const date = parseISO(user.createdAt);
      const monthKey = format(date, 'yyyy-MM'); // ex : "2025-06"
      counts[monthKey] = (counts[monthKey] || 0) + 1;
    });

    // Trie chronologiquement et convertit en tableau
    return Object.entries(counts)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, count]) => ({
        label: format(new Date(month + '-01'), 'MMM yyyy', { locale: fr }),
        count,
      }));
  }, [allUsers]);

  const tripsThisWeek = useMemo(() => {
    return allTrips.filter(
      (trip) => isThisWeek(parseISO(trip.createdAt), { weekStartsOn: 1 }) // semaine qui commence lundi
    ).length;
  }, [allTrips]);

  const contactsThisWeek = useMemo(() => {
    return allContacts.filter((contact) =>
      isThisWeek(parseISO(formatTimestampToDate(contact.createdAt)), {
        weekStartsOn: 1,
      })
    ).length;
  }, [allContacts]);

  const daysOfWeek = useMemo(() => {
    return ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  }, []);

  const tripsThisWeekByDay = useMemo(() => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 }); // lundi

    return daysOfWeek.map((day, index) => {
      const dayDate = addDays(start, index);
      const count = allTrips.filter((trip) =>
        isSameDay(parseISO(trip.createdAt), dayDate)
      ).length;

      return { label: day, count };
    });
  }, [allTrips, daysOfWeek]);

  const contactsThisWeekByDay = useMemo(() => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });

    return daysOfWeek.map((day, index) => {
      const dayDate = addDays(start, index);
      const count = allContacts.filter((contact) =>
        isSameDay(timestampToDate(contact.createdAt), dayDate)
      ).length;

      return { label: day, count };
    });
  }, [allContacts, daysOfWeek]);

  const bookingsThisWeekByDay = useMemo(() => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });

    return daysOfWeek.map((day, index) => {
      const dayDate = addDays(start, index);
      const count = allBookings.filter((booking) =>
        isSameDay(parseISO(booking.createdAt), dayDate)
      ).length;

      return { label: day, count };
    });
  }, [allContacts, daysOfWeek]);

  const bookingsThisMonthByDay = useMemo(() => {
    const start = startOfMonth(new Date());
    const end = endOfMonth(new Date());

    const daysInMonth = eachDayOfInterval({ start, end });

    return daysInMonth.map((date) => {
      const count = allBookings.filter((booking) =>
        isSameDay(parseISO(booking.createdAt), date)
      ).length;

      return { label: date.getDate().toString(), count };
    });
  }, [allBookings]);

  const commissionThisMonthByDay = useMemo(() => {
    const start = startOfMonth(new Date());
    const end = endOfMonth(new Date());
  
    const daysInMonth = eachDayOfInterval({ start, end });
  
    // Filtrer les réservations éligibles à commission
    const comissionBookings = allBookings.filter(
      (b) =>
        (b.status === 'cancelled' && b.userId === b.trip?.driverId) ||
        b.status === 'confirmed'
    );
  
    // Regrouper les commissions par jour
    return daysInMonth.map((date) => {
      const totalCommission = comissionBookings
        .filter((booking) => isSameDay(parseISO(booking.createdAt), date))
        .reduce((sum, booking) => sum + booking.totalPrice * 0.01, 0);
  
      return {
        label: date.getDate().toString(), // ex: "1", "2", ...
        count: Number(totalCommission.toFixed(2)), // valeur arrondie à 2 décimales
      };
    });
  }, [allBookings]);

  const commissionTotal = useMemo(() => {
    // Filtrer les réservations éligibles à commission
    const comissionBookings = allBookings.filter(
      (b) =>
        (b.status === 'cancelled' && b.userId === b.trip?.driverId) ||
        b.status === 'confirmed'
    );
  console.log('comissionBookings', comissionBookings);
    // Calculer la somme totale des commissions (1% du totalPrice)
    const total = comissionBookings.reduce((sum, booking) => {
      return sum + booking.totalPrice * 0.01;
    }, 0);
  
    // Arrondi à 2 décimales
    return Number(total.toFixed(2));
  }, [allBookings]);

  const loginsThisWeekByDay = useMemo(() => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });

    return daysOfWeek.map((day, index) => {
      const dayDate = addDays(start, index);
      const count = allUsers.filter(
        (user) => user.lastLogin && isSameDay(parseISO(user.lastLogin), dayDate)
      ).length;

      return { label: day, count };
    });
  }, [allUsers, daysOfWeek]);

  const roleDistribution = useMemo(() => {
    const roleCount: Record<RoleEnum, number> = {
      passenger: 0,
      driver: 0,
      admin: 0,
      employee: 0,
      suspended: 0,
    };

    allUsers.forEach((user) => {
      user.role.forEach((r) => {
        roleCount[r as RoleEnum]++;
      });
    });

    return Object.entries(roleCount).map(([role, count]) => ({
      label: role,
      count,
    }));
  }, [allUsers]);

  const simplifiedRoleDistribution = useMemo(() => {
    const simplifiedCount: Record<
      'admin' | 'employee' | 'suspended' | 'user',
      number
    > = {
      admin: 0,
      employee: 0,
      suspended: 0,
      user: 0,
    };

    allUsers.forEach((user) => {
      let counted = false;
      user.role.forEach((role) => {
        if (['admin', 'employee', 'suspended'].includes(role)) {
          simplifiedCount[role as 'admin' | 'employee' | 'suspended']++;
          counted = true;
        }
      });
      if (!counted) {
        simplifiedCount.user++;
      }
    });

    return Object.entries(simplifiedCount).map(([role, count]) => ({
      label: role,
      count,
    }));
  }, [allUsers]);

  const driverVsUsers = useMemo(() => {
    let driverCount = 0;
    let passengerCount = 0;

    allUsers.forEach((user) => {
      // On ignore ceux avec un rôle admin, employee ou suspended
      if (
        user.role.includes('admin') ||
        user.role.includes('employee') ||
        user.role.includes('suspended')
      ) {
        return;
      }

      if (user.role.includes('driver')) {
        driverCount++;
      } else {
        passengerCount++;
      }
    });

    return [
      { label: 'Driver', count: driverCount },
      { label: 'Passenger', count: passengerCount },
    ];
  }, [allUsers]);

  const chartDataToSet = {
    tripsThisWeek,
    contactsThisWeek,
    commissionTotal,
    monthlyUsers,
    commissionThisMonthByDay,
    tripsThisWeekByDay,
    bookingsThisWeekByDay,
    bookingsThisMonthByDay,
    contactsThisWeekByDay,
    loginsThisWeekByDay,
    roleDistribution,
    simplifiedRoleDistribution,
    driverVsUsers,
  };

  return {
    viewMode,
    setViewMode,
    submitting,
    handleClose,
    handleConfirm,
    selectedData,
    setSelectedData,
    dataToUpdate,
    setDataToUpdate,
    loading,
    allUsers,
    allTrips,
    allBookings,
    allContacts,
    chartDataToSet,
  };
};
