import { PrismaClient } from '@prisma/client';
import { PrismaD1 } from '@prisma/adapter-d1';

// For development (local SQLite)
function createPrismaClient() {
  if (process.env.NODE_ENV === 'production' && process.env.DB) {
    // Production: Use Cloudflare D1
    const adapter = new PrismaD1(process.env.DB as any);
    return new PrismaClient({ adapter });
  } else {
    // Development: Use local SQLite
    return new PrismaClient();
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;