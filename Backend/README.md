# Vintage Backend

Node.js + Express + SQLite REST API for the Vintage storefront. Replaces the old
Strapi setup — zero native dependencies (SQLite comes from Node's built-in
`node:sqlite` module).

## Quick start

```bash
npm install
npm run dev     # http://localhost:4000 (auto-restarts on file changes)
```

On first boot the database (`data/vintage.db`) is created and seeded with
categories, 16 products, discount codes and an admin account.

- **Admin login:** `admin@vintage.test` / `Admin@1234` (configurable in `.env`)
- **Discount codes:** `VINTAGE10` (10%) and `WELCOME5` (5%)

Requires **Node.js >= 22.5** (for `node:sqlite`).

## Scripts

| Command         | What it does                                            |
| --------------- | ------------------------------------------------------- |
| `npm run dev`   | Start with auto-reload (`node --watch`)                 |
| `npm start`     | Start normally                                          |
| `npm run reseed`| Wipe catalog + orders and restore the seed data (users kept) |

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
| POST   | `/api/newsletter`        | `{ email }` — subscribe                 |
| POST   | `/api/contact`           | `{ name, email, subject, message }`     |

### Authenticated (`Authorization: Bearer <token>`)

| Method | Endpoint              | Notes                                        |
| ------ | --------------------- | -------------------------------------------- |
| GET    | `/api/auth/me`        | Current user                                 |
| PUT    | `/api/auth/me`        | Update `{ name, phone, address }`            |
| GET    | `/api/orders`         | Customer: own orders. Admin: all orders       |
| GET    | `/api/orders/:id`     | Order detail (owner or admin)                |
| PATCH  | `/api/orders/:id`     | Admin: update `{ status }`                   |
| POST   | `/api/products`       | Admin: create product                        |
| PUT    | `/api/products/:id`   | Admin: update product                        |
| DELETE | `/api/products/:id`   | Admin: delete product                        |
| POST   | `/api/categories`    | Admin: create category                       |
| DELETE | `/api/categories/:id` | Admin: delete category (products reassigned) |
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

## How the frontend connects

`Front-end/vite.config.js` proxies `/api/*` to `http://localhost:4000`, so in
development the storefront calls the API same-origin — no CORS issues. Product
images live in `public/images/` and are served from `/api/images/...`.

## Notes

- `data/vintage.db` is git-ignored; delete it (or `npm run reseed`) to start fresh.
- `.env` is git-ignored; copy `.env.example` if it is missing. Defaults in
  `src/config.js` are used for anything unset.
