# KareOne Market Studio

Full-stack JavaScript app for KareOne’s Persian RTL service catalog, request intake, admin pricing, quote links, and email delivery.

## Run locally

```bash
npm install
cp .env.example .env
npm start
```

Open `http://localhost:3000`.

## Run with Docker Compose

```bash
cp .env.example .env
docker compose up --build -d
```

Open `http://localhost:3000`. SQLite data is persisted in a Docker volume. Stop the
container with `docker compose down`.

If port 3000 is already in use, open `http://localhost:3006` instead. You can
choose another host port with `HOST_PORT=3007 docker compose up --build -d`.

The single admin account is seeded from `ADMIN_USERNAME` and `ADMIN_PASSWORD` in `.env`. The admin panel is available at `/admin`. Change both values before deployment. Requests and quotes are persisted in SQLite at `DATABASE_FILE`.

Default local credentials:

```text
Username: admin
Password: KareOne@2026!
```

## Email delivery

Set the SMTP variables in `.env` to enable the admin panel’s «ارسال با ایمیل» action. Without SMTP settings, the quote is still saved and its secure tokenized link remains available, but the API reports that email delivery is not configured.

## Public service prices

The `/admin` dashboard contains a price and visibility control for every service. Hidden prices are never returned by the public API. If one or more selected services have public pricing enabled, the storefront calculates their quantity-based total in the cart; with all prices hidden, the storefront keeps the original request-only presentation.

## Structure

- `server/server.js` — Express API and static-file server
- `server/db.js` — SQLite schema, persistence, request and quote operations
- `server/auth.js` — JWT admin authentication
- `server/mailer.js` — Nodemailer SMTP delivery
- `server/services.js` — source of truth for ۲۵ services: the ۱۷ contract deliverables plus ۸ assessment, activation, team, and capital services
- `public/index.html` — customer storefront
- `public/admin.html` — authenticated admin panel
- `public/quote.html` — public customer quote page
- `public/js/` — modular frontend API, storefront, admin, and quote modules
- `public/css/app.css` — shared RTL design system

The old `KareOne_Commitment_Builder.html` is retained as the original visual MVP reference; the application served by `npm start` uses the modular `public/` frontend.
