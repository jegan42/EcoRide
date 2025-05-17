// backend/src/app.ts
import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import session from 'express-session';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import apiRoutes from './routes/api.routes';
import { csrfErrorHandler } from './middleware/csrf.middleware';

dotenv.config();

const app = express();

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", 'https:', 'data:'],
      scriptSrc: ["'self'", 'https://apis.google.com'],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  })
);
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);
app.use(morgan('dev'));

const windowMs =
  process.env.NODE_ENV !== 'test' ? 15 * 60 * 1000 : 60 * 60 * 1000; // 15 minutes
const maxRequests = process.env.NODE_ENV !== 'test' ? 25 : 100; // Limit to 25 requests per window

app.use(
  rateLimit({
    windowMs,
    max: maxRequests,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET ?? 'secret',
    resave: false,
    saveUninitialized: true,
  })
);
app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());

app.use('/api', apiRoutes);

app.use(csrfErrorHandler);

app.get('/', (_req: Request, res: Response) => {
  res.send('EcoRide backend is running 🚗');
});

app.use((_err: Error, _req: Request, res: Response, _next: NextFunction) => {
  res.status(500).json({ message: 'Internal Server Error' });
});

export default app;
