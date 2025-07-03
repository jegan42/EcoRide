-- UUID support
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE "VehicleEnergy" AS ENUM (
  'petrol', 'diesel', 'hybrid', 'lpg', 'electric',
  'plug_in_hybrid', 'cng', 'hydrogen', 'ethanol'
);

CREATE TYPE "TripStatus" AS ENUM (
  'open', 'full', 'cancelled', 'start', 'arrived'
);

CREATE TYPE "BookingStatus" AS ENUM (
  'pending', 'confirmed', 'cancelled'
);

CREATE TABLE "User" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  google_id TEXT UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password TEXT,
  phone TEXT,
  address TEXT,
  jwt_token TEXT UNIQUE,
  google_access_token TEXT UNIQUE,
  google_refresh_token TEXT UNIQUE,
  avatar TEXT,
  role TEXT[] NOT NULL,
  credits FLOAT DEFAULT 20,
  last_login TIMESTAMP DEFAULT now(),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE "Vehicle" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  color TEXT NOT NULL,
  vehicule_year INT NOT NULL,
  license_plate TEXT UNIQUE NOT NULL,
  energy "VehicleEnergy" NOT NULL,
  photo TEXT,
  seat_count INT NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE "Trip" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  driver_id UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES "Vehicle"(id) ON DELETE CASCADE,
  departure_city TEXT NOT NULL,
  arrival_city TEXT NOT NULL,
  departure_date TIMESTAMP NOT NULL,
  arrival_date TIMESTAMP NOT NULL,
  available_seats INT NOT NULL,
  price FLOAT NOT NULL,
  status "TripStatus" DEFAULT 'open',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE "Booking" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  canceller_id UUID REFERENCES "User"(id),
  trip_id UUID NOT NULL REFERENCES "Trip"(id) ON DELETE CASCADE,
  status "BookingStatus" NOT NULL,
  total_price FLOAT NOT NULL,
  seat_count INT NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE "UserPreferences" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  accepts_smoker BOOLEAN NOT NULL,
  accepts_pets BOOLEAN NOT NULL,
  accepts_music BOOLEAN NOT NULL,
  accepts_chatter BOOLEAN NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
