import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  // Default dev port is 3001 to avoid clashing with Next.js dev servers (commonly 3000)
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigins: process.env.CORS_ORIGINS?.split(',') || [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:8081',
    'http://localhost:19006',
  ],
}));
