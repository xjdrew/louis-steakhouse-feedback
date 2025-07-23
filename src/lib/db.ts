import { PrismaClient } from '@prisma/client'
import { PrismaD1 } from '@prisma/adapter-d1'

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { D1Database } from '@cloudflare/workers-types'

// init database local and remote: https://developers.cloudflare.com/d1/tutorials/d1-and-prisma-orm/#2-initialize-prisma-orm

// # generate the SQL statement that creates the database schema
// npx wrangler d1 migrations create prod-louis-steakhouse-feedback init_database
// npx prisma migrate diff --from-empty --to-schema-datamodel ./prisma/schema.prisma --script --output migrations/0001_init_database.sql

// # apply the migration for the local database
// npx wrangler d1 migrations apply prod-louis-steakhouse-feedback --local
// # apply the migration for the remote database
// npx wrangler d1 migrations apply prod-louis-steakhouse-feedback --remote

export async function getDb() {
  const { env } = await getCloudflareContext({ async: true });
  const adapter = new PrismaD1(env.DB as D1Database);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const prisma = new PrismaClient({ adapter } as any);
  return prisma;
}
