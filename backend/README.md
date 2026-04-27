# TripPlanner Backend

Node.js + Express + TypeScript + Prisma backend for the TripPlanner app.

See [`../backend.md`](../backend.md) for the full design document.

## Setup

```bash
npm install
cp .env.example .env
# edit .env, generate secrets:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

npx prisma migrate dev --name init
npm run dev
```

The server runs on `http://localhost:4000` by default.
