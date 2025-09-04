import { Options } from '@mikro-orm/core';
import { MySqlDriver } from '@mikro-orm/mysql';

console.log('DB_HOST:', process.env.DB_HOST);
const mikroOrmConfig: Options<MySqlDriver> = {
  driver: MySqlDriver,
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '1234',
  dbName: process.env.DB_NAME || 'techx_todo',
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  migrations: {
    path: 'dist/migrations',
    pathTs: 'src/migrations',
  },
  // debug: true,
};

export default mikroOrmConfig;
