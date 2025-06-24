# THIASIL

A modern web application for a laboratory glass manufacturing business, built with Next.js, React, and Node.js. Hosted on Vercel, with Cloudflare for DNS routing.

**Live site:** [https://www.thiasil.com/](https://www.thiasil.com/)

---

## Features
- Product catalog with categories, images, and details
- Admin panel for inventory, pricing, and coupon management
- Product backup and restore system (using Redis)
- PDF catalog generation
- Contact form and company info
- Responsive, modern UI with glassmorphism and neon effects
- Authentication for admin actions

---

## Tech Stack
- **Frontend:** Next.js (App Router), React, Tailwind CSS
- **Backend:** Node.js (API routes in Next.js)
- **Database:** JSON files for products/coupons, Redis for backups
- **Deployment:** Vercel
- **Other:** Docker (for local Redis), Cloudflare (DNS)

---

## Local Development Setup

### 1. Clone the repository
```sh
git clone https://github.com/sharanggupta/thiasil.git
cd thiasil
```

### 2. Install dependencies
```sh
npm install
```

### 3. Set up environment variables
Create a `.env.local` file (see `.env.example` if present) and set:
```
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-strong-password
REDIS_URL=redis://localhost:6379
```

### 4. Start Redis (via Docker)
```sh
docker-compose up -d
```
This will start a Redis container named `thiasil-redis` on port 6379.

### 5. Run the development server
```sh
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000)

---

## Usage

### Admin Panel
- Visit `/admin` and log in with the credentials from `.env.local`.
- Manage products, categories, inventory, and prices.
- Create, delete, and manage coupons.
- Backup and restore product data (uses Redis).
- Reset products to default using the backup management tools.

### Product Catalog
- Browse products by category on the main site.
- View product details, images, and features.
- Download the PDF catalog.

### Backups
- All product/category changes trigger a backup in Redis.
- Restore or reset data from the admin panel.

---

## Project Structure

```
├── src/
│   ├── app/                # Next.js app directory (pages, API routes, components)
│   ├── data/                # JSON data files (products, coupons, defaults)
│   ├── lib/                 # Utility modules and custom React hooks
│   └── ...
├── public/                  # Static assets (images, PDF, etc.)
├── docker-compose.yml       # Docker config for Redis
├── README.md
└── ...
```

---

## Environment Variables
- `ADMIN_USERNAME` - Username for admin login
- `ADMIN_PASSWORD` - Password for admin login
- `REDIS_URL` - Redis connection string (default: `redis://localhost:6379`)

---

## Deployment Notes
- Deployed on Vercel (see `next.config.mjs` for config)
- Uses Vercel KV in production if available, otherwise local Redis
- Cloudflare is used for DNS

---

## Contributing
PRs and issues are welcome! Please open an issue for bugs or feature requests.

---

## License
MIT
