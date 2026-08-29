import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';
import os from 'os';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function getPrismaClient(): PrismaClient {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  const isServerless = Boolean(
    process.env.VERCEL ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.NOW_REGION
  );

  let dbUrl = process.env.DATABASE_URL;

  if (isServerless) {
    try {
      const tmpDir = os.tmpdir();
      const tmpDbPath = path.join(tmpDir, 'dev.db');

      if (!fs.existsSync(tmpDbPath)) {
        const candidates = [
          path.join(process.cwd(), 'prisma', 'dev.db'),
          path.join(process.cwd(), 'dev.db'),
          path.resolve(__dirname, '..', '..', 'prisma', 'dev.db'),
          path.resolve(__dirname, '..', 'prisma', 'dev.db'),
        ];

        for (const cand of candidates) {
          if (fs.existsSync(cand)) {
            try {
              fs.copyFileSync(cand, tmpDbPath);
              break;
            } catch (e) {}
          }
        }
      }

      if (fs.existsSync(tmpDbPath)) {
        dbUrl = `file:${tmpDbPath}`;
      }
    } catch (e) {}
  }

  const client = new PrismaClient({
    datasources: dbUrl ? { db: { url: dbUrl } } : undefined,
    log: ['error'],
  });

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = client;
  }

  return client;
}

export const prisma = getPrismaClient();
export default prisma;
