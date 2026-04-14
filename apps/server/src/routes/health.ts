import { Router } from 'express';

export const healthRouter = Router();

healthRouter.get('/health', (_request, response) => {
  response.json({
    ok: true,
    app: '4218-server',
    timestamp: new Date().toISOString(),
  });
});
