// backend/src/routes/index.ts
import authRoutes from './auth.routes';
import vehicleRoutes from './vehicle.routes';
import tripRoutes from './trip.routes';
import bookingRoutes from './booking.routes';
import UserPreferencesRoutes from './userPreferences.routes';

export {
  authRoutes,
  vehicleRoutes,
  tripRoutes,
  bookingRoutes,
  UserPreferencesRoutes,
};
