import { execSync } from 'node:child_process';
import { existsSync, unlinkSync } from 'node:fs';
import { resolve } from 'node:path';

export default function setup() {
  const dbPath = resolve(__dirname, '../../prisma/test.db');
  if (existsSync(dbPath)) {
    unlinkSync(dbPath);
  }

  execSync('npx prisma db push --skip-generate --accept-data-loss', {
    stdio: 'inherit',
    env: {
      ...process.env,
      DATABASE_URL: 'file:./test.db',
    },
  });
}
