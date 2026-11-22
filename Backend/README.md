# Vintage Backend

Node.js + Express REST API for the Vintage storefront. The data layer uses the
official `@libsql/client` driver in both environments:

- **Local development** → SQLite file at `data/vintage.db` (`file:` URL).
- **Production (Vercel)** → [Turso](https://turso.tech) cloud SQLite over HTTP.

Routes and JSON responses are identical in both modes.

## Quick start (local)

```bash
npm install
cp .env.example .env   # optional locally; required in production
npm run dev            # http://localhost:4000 (auto-restarts on file changes)
```

On first boot the database (`data/vintage.db`) is created and seeded with
categories, 17 products, discount codes and an admin account.

- **Admin login:** `admin@vintage.test` / `Admin@1234` (dev defaults only; set
  `ADMIN_EMAIL` and `ADMIN_PASSWORD` explicitly in production)
- **Discount codes:** `VINTAGE10` (10%) and `WELCOME5` (5%)

Requires **Node.js >= 22.5**.

## Scripts

| Command            | What it does                                                    |
| ------------------ | --------------------------------------------------------------- |
| `npm run dev`      | Start with auto-reload (`node --watch`)                         |
| `npm start`        | Start normally (local only; Vercel uses `api/index.js`)         |
| `npm run db:backup`| Copy `data/vintage.db` + JSON dumps into `data/backups/<stamp>/`|
| `npm run db:migrate` | Copy local data into the Turso database named in `.env`       |
| `npm run db:verify` | Count rows on Turso and compare with the local database        |
| `npm run test:api` | Run the end-to-end smoke test against `http://localhost:4000/api`|
| `npm run reseed`   | Wipe catalog + orders and restore the seed data (users kept)    |

The smoke test accepts a different target and an upload flag:

```bash
node scripts/smoke-test.js https://<your-api>.vercel.app/api --with-upload
```

## API

All responses use the envelope `{ "data": ... }`; errors use
`{ "error": "message" }` with a proper HTTP status.

### Public

| Method | Endpoint                 | Notes                                   |
| ------ | ------------------------ | --------------------------------------- |
| GET    | `/api/health`            | Liveness check                          |
| GET    | `/api/products`          | Full catalog (client filters/sorts)     |
| GET    | `/api/products/:idOrSlug`| Single product by numeric id or slug    |
| GET    | `/api/categories`        | Categories incl. product counts         |
| POST   | `/api/orders`            | Place an order (guest or signed-in)     |
| POST   | `/api/auth/register`     | `{ name, email, password }`             |
| POST   | `/api/auth/login`        | `{ email, password }`                   |
| GET    | `/api/auth/google`       | Start Google OAuth (redirect)           |
| GET    | `/api/auth/google/callback` | Google OAuth callback (redirect)      |
| GET    | `/api/auth/facebook`     | Start Facebook OAuth (redirect)         |
| GET    | `/api/auth/facebook/callback` | Facebook OAuth callback (redirect) |
| POST   | `/api/newsletter`        | `{ email }` — subscribe                 |
| POST   | `/api/contact`           | `{ name, email, subject, message }`     |

### Authenticated (`Authorization: Bearer <token>`)

| Method | Endpoint              | Notes                                        |
| ------ | --------------------- | -------------------------------------------- |
| GET    | `/api/auth/me`        | Current user                                 |
| PUT    | `/api/auth/me`        | Update `{ name, phone, address }`            |
| GET    | `/api/wishlist`       | Current user's wishlist (server-synced)      |
| POST   | `/api/wishlist`       | Merge/sync `{ productIds: [] }`              |
| POST   | `/api/wishlist/toggle`| Toggle `{ productId }`                       |
| DELETE | `/api/wishlist/:productId` | Remove from wishlist                    |
| GET    | `/api/orders`         | Customer: own orders. Admin: all orders       |
| GET    | `/api/orders/:id`     | Order detail (owner or admin)                |
| PATCH  | `/api/orders/:id`     | Admin: update `{ status }`                   |
| POST   | `/api/products`       | Admin: create product                        |
| PUT    | `/api/products/:id`   | Admin: update product                        |
| DELETE | `/api/products/:id`   | Admin: delete product                        |
| POST   | `/api/categories`    | Admin: create category                       |
| DELETE | `/api/categories/:id` | Admin: delete category (products reassigned) |
| POST   | `/api/uploads`        | Admin: upload image (multipart `image`) → `{ data: { url } }` |
| GET    | `/api/users`          | Admin: customers with order stats            |
| GET    | `/api/newsletter`     | Admin: subscriber list                        |
| GET    | `/api/contact`        | Admin: contact inbox                         |
| PATCH  | `/api/contact/:id`    | Admin: mark message read                     |
| DELETE | `/api/contact/:id`    | Admin: delete message                        |

### Orders

`POST /api/orders` recomputes every total **server-side** from database prices
(the client's subtotal is never trusted), validates stock, decrements it, and
returns the order in the exact shape the storefront expects:

```json
{
  "id": "VT-000001",
  "createdAt": "2026-11-11T...",
  "status": "Processing",
  "customer": { "fullName": "...", "email": "...", "...": "..." },
  "paymentMethod": "cash",
  "items": [{ "id": 1, "name": "...", "price": 899, "image": "/api/images/...", "quantity": 1 }],
  "subtotal": 899,
  "shipping": 12,
  "discountCode": "VINTAGE10",
  "discountAmount": 89.9,
  "total": 821.1
}
```

## Images & uploads

- Static/catalog images in `Backend/public/images/` are served at `/api/images/...`.
  They are included in the Vercel function bundle via `vercel.json` → `includeFiles`,
  so **existing image URLs keep working** after deployment.
- **Local development:** uploads are written to `public/images/uploads/products/`.
- **Production:** set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` and
  `CLOUDINARY_API_SECRET`; uploads go to Cloudinary via its signed REST API and
  an absolute CDN URL is returned. No extra dependency is needed. If these are
  missing on Vercel, `POST /api/uploads` returns `503` instead of silently
  writing to an ephemeral filesystem.
- The maximum upload size is 4 MB (Vercel request bodies cap at ~4.5 MB).
- Product `image` fields may be a relative API path, a Cloudinary URL, or any
  external URL. The storefront/admin resolve relative paths using `assetUrl()`.

## Accounts & auth

- Customers can **register/login with email & password**, sign in with **Google/Facebook** (when OAuth credentials are set in `.env`), or continue as **guests** (cart/wishlist stored locally; guest checkout supported).
- The storefront **Dashboard** (`/dashboard`) requires a signed-in account; guests are redirected to login/register.
- Signed-in customers get their profile, orders, and **wishlist synced to the database** (local wishlist is merged on sign-in).

## How the frontend connects

- **Local:** the Vite dev servers (`Front-end` on `:5173`, `Admin-Panel` on
  `:5174`) proxy `/api/*` to `http://localhost:4000`, so requests are
  same-origin.
- **Production:** set `VITE_API_BASE=https://<backend>.vercel.app/api` in both
  Vite projects. Relative image paths are resolved against the API origin by
  `src/utils/assets.js` (`assetUrl`).

CORS accepts only the comma-separated origins in `CORS_ORIGIN` (plus
`FRONTEND_URL`) — e.g. the two Vercel storefront/admin domains.

## Deploying to Vercel

### 1. Create the cloud database (manual, one time)

```bash
npm i -g turso-cli
turso auth signup            # or: turso auth login
turso db create vintage
turso db show vintage --url  # → TURSO_DATABASE_URL
turso db tokens create vintage  # → TURSO_AUTH_TOKEN
```

Put the URL and token in `Backend/.env` for the migration, and in the Vercel
project's Environment Variables for runtime. **Never commit them.**

### 2. Migrate the existing data

```bash
npm run db:backup    # timestamped copy + JSON dump, local DB stays untouched
npm run db:migrate   # schema + data → Turso (use --force only if re-copying)
npm run db:verify    # row counts must match
node scripts/smoke-test.js --with-upload
```

`--verify-only` and `--force` are available on `db:migrate`. The local database
in `Backend/data/vintage.db` is **read-only** during migration and is never
deleted.

### 3. Deploy the API

Create a Vercel project with **Root Directory = `Backend`** (Framework:
Other). Set these Environment Variables:

| Variable | Value |
| --- | --- |
| `TURSO_DATABASE_URL` | URL from `turso db show vintage --url` |
| `TURSO_AUTH_TOKEN` | Token from `turso db tokens create vintage` |
| `JWT_SECRET` | Long random secret |
| `CORS_ORIGIN` | Storefront and admin Vercel domains, comma-separated |
| `FRONTEND_URL` | Storefront domain |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Explicit admin credentials |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Cloudinary credentials for uploads |

`Backend/vercel.json` rewrites every path to `api/index.js`; `api/index.js`
awaits `initDb()` + `ensureSeed()` per cold start and passes the request to the
same Express app — there is **no `app.listen` on Vercel** and no writable local
storage.

### 4. Point the React apps at the API

In both `Front-end` and `Admin-Panel` Vercel projects set:

```
VITE_API_BASE=https://<backend>.vercel.app/api
```

For the admin project also set `VITE_STORE_URL=https://<storefront>.vercel.app`.
Redeploy both projects after changing env vars (Vite bakes them at build time).

### 5. Verify the deployment

```bash
node scripts/smoke-test.js https://<backend>.vercel.app/api --with-upload
```

Then open the storefront and admin in a browser: log in, load products/images,
add to cart, place an order, upload a product image. Build success alone is not
enough.

## Notes

- Vercel Hobby is for non-commercial use; a real store should use Pro.
- Turso Free includes 100 databases, 5 GB storage, 500M row reads / 10M writes
  per month — more than enough for this catalog.
- Cloudinary Free includes 25 credits/month.
- `.env` files are git-ignored; only `.env.example` (names, no secrets) is tracked.
- Tables are created/migrated automatically on startup; `app_meta.schema_version`
  prevents repeating DDL on each cold start.
- Keep the local `data/vintage.db` backup — do not delete it until the remote
  copy and the deployment have been verified.
