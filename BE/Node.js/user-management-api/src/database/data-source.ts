import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

export const AppDataSource = new DataSource({
  type: 'mssql',
  host: 'localhost',
  username: process.env.DB_USERNAME || 'ramesh',
  password: process.env.DB_PASSWORD || 'YourStrongPassword123!',
  database: process.env.DB_DATABASE || 'user_management',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false, // Always false for migrations
  logging: true,
  options: {
    encrypt: false, // Use this if you're on Windows Azure
    trustServerCertificate: true, // Use this if you're on Windows Azure
  },
});
