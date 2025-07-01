// backend/src/app.ts
import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { setupGoogleStrategy } from './passport/google.strategy';
import session from 'express-session';
import cors from 'cors';
import morgan from 'morgan';

import apiRoutes from './routes/api.routes';
import {
  conditionalCsrfProtection,
  csrfErrorHandler,
} from './middleware/csrf.middleware';
import { errorHandler } from './middleware/error.middleware';
import { getRateLimitConfig } from './utils/rateLimitConfig';
import { getNodeEnv, getSessionSecret } from './utils/env';

setupGoogleStrategy();

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
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  })
);
app.use(morgan('dev'));

const mode = getNodeEnv();

app.use(rateLimit(getRateLimitConfig(mode)));

const secret = getSessionSecret();

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('trust proxy', 1);
app.use(
  session({
    secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: mode === 'production',
      httpOnly: true,
      sameSite: mode === 'production' ? 'none' : 'lax',
    },
  })
);

app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());
app.use((req, _res, next) => {
  console.log('Cookies:', req.headers.cookie);
  next();
});
app.use(conditionalCsrfProtection);

app.use('/api', apiRoutes);

app.use(csrfErrorHandler);

app.get('/', (_req: Request, res: Response) => {
  res.send('EcoRide backend is running 🚗');
});

app.use(errorHandler);

export default app;
