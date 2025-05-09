import express, { Request, Response } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { PrismaClient } from '../generated/prisma/client';

const app = express();
const prisma = new PrismaClient();

const PORT = process.env.PORT ?? 4000;

// Middleware de sécurité
app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limite de requêtes
}));

// Middleware pour analyser les cookies et les sessions
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET ?? 'secret',
  resave: false,
  saveUninitialized: true,
}));

// Middleware pour parse les corps des requêtes en JSON
app.use(express.json());

// Endpoint de test
app.get('/testalluser', async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.get('/', async (req: Request, res: Response) => {
  res.send(`EcoRide backend is running 🚗 on port ${PORT} to test`);
});

// Démarre le serveur
app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
