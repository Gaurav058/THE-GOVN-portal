import { PrismaClient } from '@prisma/client';
import { DevelopmentRepository } from './memory-store';
import { PrismaRepository } from './prisma-repository';
import { IJobRepository, JobFilterParams } from './repository.interface';

declare global {
  // eslint-disable-next-line no-var
  var __prismaClient: PrismaClient | undefined;
  // eslint-disable-next-line no-var
  var __dbRepository: IJobRepository | undefined;
}

export function getPrismaClient(): PrismaClient {
  if (process.env.NODE_ENV === 'production') {
    return new PrismaClient();
  }
  if (!global.__prismaClient) {
    global.__prismaClient = new PrismaClient();
  }
  return global.__prismaClient;
}

export function getRepository(): IJobRepository {
  if (global.__dbRepository) {
    return global.__dbRepository;
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (databaseUrl && !databaseUrl.includes('placeholder')) {
    console.log('[DatabaseFactory] Initializing production PrismaRepository (PostgreSQL)');
    const prisma = getPrismaClient();
    const repo = new PrismaRepository(prisma);
    global.__dbRepository = repo;
    return repo;
  }

  console.log('[DatabaseFactory] DATABASE_URL not set; initializing DevelopmentRepository (In-Memory verified store)');
  const repo = new DevelopmentRepository();
  global.__dbRepository = repo;
  return repo;
}

export const dbRepository: IJobRepository = getRepository();

export type { IJobRepository, JobFilterParams };
export { PrismaRepository, DevelopmentRepository };
