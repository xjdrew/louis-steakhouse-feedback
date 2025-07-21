# Available Scripts

## Development Commands

- `npm run dev` - Start the development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code quality checks

## Database Commands

- `npm run postinstall` - Automatically generates Prisma client after npm install
- `npm run db:generate` - Generate Prisma client manually
- `npm run db:push` - Push database schema to database (for development/production setup)
- `npm run db:migrate` - Create and run database migrations (for development)
- `npm run db:studio` - Open Prisma Studio for database management

## Production Deployment

1. Set `DATABASE_URL` environment variable
2. Run `npm install` (automatically runs `postinstall` to generate Prisma client)
3. Run `npm run db:push` to initialize database schema
4. Run `npm run build` to build the application
5. Run `npm run start` to start the production server