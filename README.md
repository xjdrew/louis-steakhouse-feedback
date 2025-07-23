# Louis' Steak House Feedback System

A comprehensive feedback collection and management system for restaurants, built with Next.js 15, TypeScript, Tailwind CSS, and Prisma ORM. **Optimized for Cloudflare Workers deployment** with D1 database support.

## Features

- **Customer Feedback Submission**: Easy-to-use form with rating system (1-5 stars)
- **Feedback Tracking**: Customers can check their feedback status using a unique ID
- **Admin Dashboard**: Secure admin panel for managing all feedback
- **Status Management**: Track feedback processing (Unprocessed → Processing → Processed)
- **Modern UI**: Clean, responsive interface with Tailwind CSS
- **Cloudflare Workers**: Serverless deployment with edge computing
- **Database Support**: Cloudflare D1 (SQLite-compatible) for production, SQLite for development

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm/yarn/pnpm
- Wrangler CLI (for Cloudflare deployment)

### Local Development Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd louis-steakhouse-feedback
```

2. Install dependencies:
```bash
npm install
```

3. Set up local environment:
```bash
# Copy development environment variables
cp .dev.vars.example .dev.vars
```

Configure `.dev.vars` for local development.

4. Initialize the local database:
```bash
# Generate Prisma client
npm run db:generate

# Apply database schema locally
npx wrangler d1 migrations apply prod-louis-steakhouse-feedback --local
```

5. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Available Scripts

### Development
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run lint` - Run ESLint

### Database Management
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Create and run migrations
- `npm run db:studio` - Open Prisma Studio

### Cloudflare Deployment
- `npm run deploy` - Build and deploy to Cloudflare Workers
- `npm run preview` - Build and preview deployment locally
- `npm run cf-typegen` - Generate Cloudflare environment types

## Usage

### For Customers

1. **Submit Feedback**: Visit the homepage and click "Submit Feedback"
2. **Fill Form**: Add your name (optional), contact info (optional), dining time (optional), rating (1-5), and feedback content
3. **Get ID**: After submission, save the feedback ID to track status later
4. **Check Status**: Use "View My Feedback" to check processing status

### For Administrators

1. **Login**: Visit `/admin/login` with configured credentials
2. **Dashboard**: View all feedback with filtering options
3. **Manage**: Update feedback status and add responses
4. **Filter**: View by status (Unprocessed/Processing/Processed)

## Database Setup

This project uses **Cloudflare D1** (SQLite-compatible) for production and local SQLite for development.

### Database Initialization Process

The database is initialized using migrations located in `/migrations/0001_init_database.sql`. The process is:

1. **Generate migration**: 
```bash
# Create migration file (already done)
npx wrangler d1 migrations create prod-louis-steakhouse-feedback init_database

# Generate SQL from Prisma schema (already done)
npx prisma migrate diff --from-empty --to-schema-datamodel ./prisma/schema.prisma --script --output migrations/0001_init_database.sql
```

2. **Apply migration locally**:
```bash
npx wrangler d1 migrations apply prod-louis-steakhouse-feedback --local
```

3. **Apply migration to production**:
```bash
npx wrangler d1 migrations apply prod-louis-steakhouse-feedback --remote
```

### Database Connection

The app uses `src/lib/db.ts` which:
- Uses `@opennextjs/cloudflare` to get the Cloudflare context
- Creates a PrismaD1 adapter for D1 database access
- Returns a configured Prisma client instance

## Deployment to Cloudflare Workers

This project is pre-configured for Cloudflare Workers deployment using OpenNext.js.

### Prerequisites

1. **Install Wrangler CLI**:
```bash
npm install -g wrangler
# or use the local version: npx wrangler
```

2. **Authenticate with Cloudflare**:
```bash
wrangler login
```

### Initial Setup

1. **Create D1 Database** (if not already created):
```bash
wrangler d1 create prod-louis-steakhouse-feedback
```

2. **Update `wrangler.toml`** with your database ID:
```toml
[[d1_databases]]
binding = "DB"
database_name = "prod-louis-steakhouse-feedback"
database_id = "your-actual-database-id"  # Replace with actual ID
```

3. **Deploy database schema**:
```bash
npx wrangler d1 migrations apply prod-louis-steakhouse-feedback --remote
```

### Deploy Application

1. **Build and deploy in one command**:
```bash
npm run deploy
```

Or manually:
```bash
# Build the application
npx opennextjs-cloudflare build

# Deploy to Cloudflare Workers
npx opennextjs-cloudflare deploy
```

### Environment Variables

The production environment variables are configured in `wrangler.toml`:

```toml
[vars]
NODE_ENV = "production"
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "secret_for_2025"  # Change this!
```

**Important**: Update the `ADMIN_PASSWORD` in `wrangler.toml` before deployment.

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: Prisma ORM with Cloudflare D1 (SQLite-compatible)
- **Database Adapter**: `@prisma/adapter-d1` for D1 integration
- **Authentication**: Cookie-based session management
- **Deployment**: Cloudflare Workers with OpenNext.js
- **Build Tool**: Turbopack (dev), OpenNext.js (production)

## Project Structure

```
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── admin/
│   │   │   ├── dashboard/ # Admin dashboard
│   │   │   └── login/     # Admin login
│   │   ├── api/
│   │   │   ├── admin/     # Admin API routes
│   │   │   └── feedback/  # Feedback API routes
│   │   ├── feedback/
│   │   │   ├── submit/    # Feedback submission form
│   │   │   ├── success/   # Success page
│   │   │   └── view/      # Feedback lookup
│   │   └── page.tsx       # Homepage
│   └── lib/
│       ├── auth.ts        # Authentication utilities
│       └── db.ts          # Cloudflare D1 database connection
├── migrations/            # D1 database migrations
│   └── 0001_init_database.sql
├── prisma/
│   └── schema.prisma      # Database schema
├── wrangler.toml          # Cloudflare Workers configuration
├── open-next.config.ts    # OpenNext.js configuration
└── cloudflare-env.d.ts    # Cloudflare environment types
```

## Key Configuration Files

- **`wrangler.toml`**: Cloudflare Workers configuration with D1 database binding
- **`open-next.config.ts`**: OpenNext.js configuration for Cloudflare deployment
- **`src/lib/db.ts`**: Database connection using PrismaD1 adapter
- **`migrations/0001_init_database.sql`**: D1 database schema migration

## License

This project is private and proprietary.
