import { registerAs } from '@nestjs/config';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

export default registerAs('config', () => {
  return {
    port: parseInt(process.env.PORT, 10) || 3000,
    database: {
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
    },
    jwtSecret: process.env.JWT_SECRET,
    wompi: {
      publicKey: process.env.WOMPI_PUBLIC_KEY,
      privateKey: process.env.WOMPI_PRIVATE_KEY,
      integrationKey: process.env.WOMPI_INTEGRATION_KEY,
      apiUrl: process.env.WOMPI_API_URL,
    },
  };
});
