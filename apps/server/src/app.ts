import cors from 'cors';
import express from 'express';
import { env } from './config/env';
import { healthRouter } from './routes/health';

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: env.clientUrl,
    })
  );

  app.use(express.json());
  app.use(healthRouter);

  return app;
}
