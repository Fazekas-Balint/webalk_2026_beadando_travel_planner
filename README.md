# TripPlanner

A web app for planning trips: itinerary on a map, day-by-day activities, weather, costs.

## Project structure

```
project_folder/
├── frontend/        # React + Vite + TypeScript
├── backend/         # Node.js + Express + TypeScript + Prisma
```

## Getting started

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
cp .env.example .env
npx prisma migrate dev --name init
npm run dev
```
## Environment variables

A projekt két `.env` fájlt használ — egyet a backend, egyet a frontend
gyökerében. **NE commit-old őket** (`.gitignore` már védi).

### `backend/.env`

Másold át a sablont és töltsd ki:

```bash
cp backend/.env.example backend/.env
```
# AI generált README
Sablon:

```env
# Server
NODE_ENV=development
PORT=4000
FRONTEND_URL=http://localhost:5173

# Database (SQLite, file alapú — a fájl auto-generálódik a migráció után)
DATABASE_URL="file:./dev.db"

# JWT — kötelező, min. 32 karakter, két különböző érték
# Generálj erős secret-et: node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=

JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Cookie
COOKIE_DOMAIN=localhost

# External APIs
NOMINATIM_USER_AGENT="TripPlanner/1.0 (your-email@example.com)"
```

### `frontend/.env`

```bash
cp frontend/.env.example frontend/.env
```

Sablon:

```env
# A backend API URL-je. Lokálisan a backend porton fut.
VITE_API_URL=http://localhost:4000/api
```

### Production értékek (Vercel + Render)

| Hol | Változó | Érték |
|---|---|---|
| Render (backend) | `NODE_ENV` | `production` |
| Render | `FRONTEND_URL` | a Vercel deploy URL (pl. `https://your-app.vercel.app`) |
| Render | `JWT_ACCESS_SECRET` | generált 64+ char hex |
| Render | `JWT_REFRESH_SECRET` | másik generált 64+ char hex |
| Vercel (frontend) | `VITE_API_URL` | a Render backend URL `/api` végződéssel |

### JWT secret generálás

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

