// One shared Prisma client for the whole app.
// While you develop, Next.js reloads files all the time. Without this trick every reload
// would open a brand-new database connection. Parking the client on `globalThis`
// lets it survive reloads.
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
