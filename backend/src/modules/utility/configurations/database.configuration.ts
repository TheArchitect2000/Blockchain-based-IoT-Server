import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  host: process.env.MONGO_HOST,
  port: process.env.MONGO_PORT || 27017,
  connection: process.env.MONGO_CONNECTION,
}));
