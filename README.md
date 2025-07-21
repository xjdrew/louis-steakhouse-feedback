# Louis' Steak House Feedback System

A comprehensive feedback collection and management system for restaurants, built with Next.js, TypeScript, Tailwind CSS, and Prisma ORM.

## Features

- **Customer Feedback Submission**: Easy-to-use form with rating system (1-5 stars)
- **Feedback Tracking**: Customers can check their feedback status using a unique ID
- **Admin Dashboard**: Secure admin panel for managing all feedback
- **Status Management**: Track feedback processing (Unprocessed → Processing → Processed)
- **Material Design UI**: Clean, responsive interface
- **Database Support**: SQLite for development, Cloudflare D1 for production

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm/yarn/pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd louis-steakhouse-feedback
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Configure the following variables:
```env
DATABASE_URL="file:./dev.db"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="your-secure-password"
```

4. Initialize the database:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Create and run migrations
- `npm run db:studio` - Open Prisma Studio

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

## Deployment

### Cloudflare Pages + Workers

1. **Prepare for deployment**:
```bash
npm run build
```

2. **Install Wrangler CLI**:
```bash
npm install -g wrangler
```

3. **Create Cloudflare D1 database**:
```bash
wrangler d1 create louis-steakhouse-feedback
```

4. **Update wrangler.toml**:
```toml
name = "louis-steakhouse-feedback"
compatibility_date = "2024-01-01"

[[d1_databases]]
binding = "DB"
database_name = "louis-steakhouse-feedback"
database_id = "your-database-id"
```

5. **Set environment variables**:
```bash
wrangler secret put ADMIN_USERNAME
wrangler secret put ADMIN_PASSWORD
```

6. **Update Prisma schema for D1**:
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
  previewFeatures = ["driverAdapters"]
}
```

7. **Deploy database schema**:
```bash
wrangler d1 execute louis-steakhouse-feedback --remote --file=./prisma/migrations/init.sql
```

8. **Deploy to Cloudflare**:
```bash
wrangler pages deploy ./out
```

### Environment Variables for Production

- `DATABASE_URL`: Cloudflare D1 connection string
- `ADMIN_USERNAME`: Admin login username
- `ADMIN_PASSWORD`: Admin login password

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Prisma ORM with SQLite/Cloudflare D1
- **Authentication**: Cookie-based session management
- **Deployment**: Cloudflare Pages + Workers

## Project Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── dashboard/     # Admin dashboard
│   │   └── login/         # Admin login
│   ├── api/
│   │   ├── admin/         # Admin API routes
│   │   └── feedback/      # Feedback API routes
│   ├── feedback/
│   │   ├── submit/        # Feedback submission form
│   │   ├── success/       # Success page
│   │   └── view/          # Feedback lookup
│   └── page.tsx           # Homepage
├── lib/
│   ├── auth.ts            # Authentication utilities
│   └── db.ts              # Database connection
└── prisma/
    └── schema.prisma      # Database schema
```

## License

This project is private and proprietary.
