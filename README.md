# Drilex Portfolio

Production-ready Next.js portfolio with PostgreSQL, raw SQL, and Docker — no ORM.

---

## Stack

| Layer        | Technology                            |
|-------------|---------------------------------------|
| Framework   | Next.js 15 (App Router)               |
| Database    | PostgreSQL 16 via `pg` (raw SQL only) |
| Styling     | CSS Modules + Global CSS Variables    |
| Runtime     | Node.js 22 (Alpine)                   |
| Container   | Docker + Docker Compose               |

---

## Local development

### 1. Clone and install

```bash
git clone https://github.com/drilexik/portfolio
cd drilex-portfolio
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Then edit .env with your real values:
nano .env
```

Required variables:

```env
PORT=5000
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=drilex
POSTGRES_USER=drilex
POSTGRES_PASSWORD=supersecretpassword
ADMIN_PASSWORD=changeme_before_deploy
```

### 3. Start a local PostgreSQL (optional — skip if you already have one)

```bash
docker run -d \
  --name drilex-pg \
  -e POSTGRES_DB=drilex \
  -e POSTGRES_USER=drilex \
  -e POSTGRES_PASSWORD=supersecretpassword \
  -p 5432:5432 \
  postgres:16-alpine
```

### 4. Run dev server

```bash
npm run dev
# → http://localhost:5000
```

The schema is created automatically on first request.

---

## Production deployment (VPS via Docker)

### 1. Copy files to your VPS

```bash
rsync -az --exclude node_modules --exclude .next . user@your-vps:/srv/drilex/
```

### 2. Create `.env` on the VPS

```bash
ssh user@your-vps
cd /srv/drilex
cp .env.example .env
nano .env   # fill in real secrets
```

### 3. Build and start

```bash
docker compose up -d --build
```

This will:
- Build the Next.js app in a multi-stage Docker image
- Start a PostgreSQL 16 container
- Expose the app on `http://your-vps:${PORT}` (default `5000`)
- Persist database data in the `pg_data` named volume
- Persist uploaded images in the `uploads` named volume

### 4. View logs

```bash
docker compose logs -f app
docker compose logs -f db
```

### 5. Update the app

```bash
git pull
docker compose up -d --build
```

---

## Admin panel

Navigate to `/admin` — this URL is **not linked anywhere** in the public site.

- Enter the `ADMIN_PASSWORD` from your `.env`
- Add projects: title, redirect URL, and an optional image
- Delete projects with the delete button
- Session expires after 8 hours (httpOnly cookie)

---

## Architecture notes

### Database (`lib/db.ts`)
- Uses a singleton `pg.Pool` safe for Next.js hot-reload in development
- All queries use parameterised placeholders (`$1`, `$2`, …) — immune to SQL injection
- Schema is created via `CREATE TABLE IF NOT EXISTS` on every cold start

### File uploads
- Images are saved to `public/uploads/` with a timestamp+random filename
- In production, this directory is mounted as the `uploads` Docker named volume
- Max upload size: 8 MB (also set via `serverActions.bodySizeLimit` in `next.config.ts`)

### Auth
- Simple password comparison against `ADMIN_PASSWORD` env variable
- On success, an httpOnly session cookie is set (8-hour TTL)
- All Server Actions re-check auth before executing

### Ports
- `PORT` in `.env` drives everything: `npm run dev`, `npm start`, the Dockerfile `EXPOSE`, and the `docker-compose.yml` port mapping
- Default: `5000` (avoids conflicts with the occupied `3000` and `8080`)

---

## Project structure

```
drilex-portfolio/
├── app/
│   ├── actions.ts           # Server Actions (login, create/delete project)
│   ├── globals.css          # Design tokens + global styles
│   ├── layout.tsx           # Root layout + DB schema init
│   ├── page.tsx             # Public home page (Server Component)
│   ├── page.module.css      # Home page styles
│   ├── admin/
│   │   ├── page.tsx         # Hidden admin route
│   │   ├── LoginForm.tsx    # Client login form
│   │   └── AdminDashboard.tsx # Client dashboard
│   └── api/
│       └── init-db/
│           └── route.ts     # DB init API route (fallback)
├── lib/
│   ├── db.ts                # pg Pool + initSchema()
│   └── types.ts             # Shared TypeScript types
├── public/
│   └── uploads/             # Uploaded project images (volume in prod)
├── .env.example             # Environment variable template
├── .dockerignore
├── .gitignore
├── Dockerfile               # Multi-stage production build
├── docker-compose.yml       # Full stack compose with volumes
├── next.config.ts
├── package.json
└── tsconfig.json
```
