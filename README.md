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
