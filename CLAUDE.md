# Bash commands
- npm run dev: Start development server with Turbopack
- npm run build: Build for production
- npm run lint: Run ESLint
- npm run db:generate: Generate Prisma client
- npm run db:push: Push schema to database
- npm run db:migrate: Create and run migrations
- npm run db:studio: Open Prisma Studio
- npm run deploy: Build and deploy to Cloudflare Workers
- npm run preview: Build and preview deployment locally
- npm run cf-typegen: Generate Cloudflare environment types
- npx wrangler d1 list: List D1 databases

# Code style
- Use ES modules (import/export) syntax, not CommonJS (require)
- Destructure imports when possible (eg. import { foo } from 'bar')

# Workflow
- Be sure to typecheck when you’re done making a series of code changes
- Prefer running single tests, and not the whole test suite, for performance
- Be sure to update `prompt/todos.md` after you finish a task