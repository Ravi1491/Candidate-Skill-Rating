export const applicationConfig = {
  app: {
    env: process.env.NODE_ENV,
    port: parseInt(process.env.PORT, 10) || 8080,
  },
};
