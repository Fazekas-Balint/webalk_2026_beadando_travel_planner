import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    fileParallelism: false,
    maxWorkers: 1,
    pool: 'forks',
    globalSetup: ['./tests/setup/globalSetup.ts'],

    env: {
      NODE_ENV: 'test',
      FRONTEND_URL: 'http://localhost:5173',
      DATABASE_URL: 'file:./test.db',
      JWT_ACCESS_SECRET: 'super-secret-test-access-key-1234567890',
      JWT_REFRESH_SECRET: 'super-secret-test-refresh-key-1234567890',
    },
  },
});
