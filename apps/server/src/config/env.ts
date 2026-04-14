export const env = {
  serverPort: Number(process.env.SERVER_PORT ?? 4000),
  clientUrl: process.env.CLIENT_URL ?? 'http://localhost:3000',
};
