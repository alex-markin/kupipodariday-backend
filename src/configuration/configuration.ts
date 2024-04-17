import { join } from 'path';

export default () => ({
  server: { port: parseInt(process.env.SERVER_PORT, 10) || 3000 },
  database: {
    type: process.env.DATABASE_TYPE || 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    username: process.env.DATABASE_USER || 'student',
    password: process.env.DATABASE_PASSWORD || 'student',
    database: process.env.DATABASE_NAME || 'kupipodariday',
    entities: [join(__dirname, '/../**/*.entity.{js,ts}')],
    synchronize: Boolean(process.env.DATABASE_SYNCHRONIZE) || true,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'secret',
    exp: process.env.JWT_EXP || '30m',
  },
});
