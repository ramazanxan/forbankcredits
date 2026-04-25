# NeuroBank Frontend

Frontend-only banking platform for NeuroBank built with `React + Vite + TypeScript`.

## Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- Framer Motion
- Zustand
- i18next
- react-dropzone
- xlsx
- fetch via `src/api/api.ts`

## Local start

1. Install dependencies:

```bash
npm install
```

2. Create env file if needed:

```powershell
Copy-Item .env.example .env
```

3. Start frontend:

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`.

## Backend integration

By default the project can work in mock mode.

Env variables:

- `VITE_USE_MOCK_API=true` enables in-memory demo responses.
- `VITE_USE_MOCK_API=false` switches requests to real backend.
- `VITE_API_BASE_URL=` keeps requests relative, so `/api/*` is proxied by Vite in development and by nginx in Docker.

When backend is running on `http://localhost:8000`, Vite proxies `/api` to Django automatically.

## Docker

Build and run frontend in Docker:

```bash
docker compose up --build
```

Then open:

- `http://localhost:4173`

What Docker setup does:

- builds the Vite app in a Node container
- serves static files from nginx
- proxies `/api/*` to `http://host.docker.internal:8000`
- supports SPA routing via `try_files ... /index.html`

If your backend is also local, keep Django on port `8000`.

## Main routes

- `/`
- `/login`
- `/register`
- `/client`
- `/client/score`
- `/client/apply`
- `/moderator`
- `/admin/it`
- `/admin/it/batch-test`
- `/admin/bank`

## Notes

- Batch-test data is stored in JS memory and resets after reload.
- Notifications for batch runs are intentionally refresh-based in demo mode.
- The site now uses the native system cursor instead of the previous lagging custom cursor layer.
