# Outbox UI
React + TypeScript + Tailwind (Vite). `npm i && npm run dev`.
Runs on mock data by default. Set `VITE_API_URL` (see .env.example) to use your backend:
GET /api/me · GET /auth/google · GET /auth/slack · POST /auth/logout · GET /api/emails?status=scheduled|sent · POST /api/schedule
Deploy: Vercel/Netlify, build `npm run build`, output `dist`.
