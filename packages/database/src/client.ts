import { PrismaClient } from '@prisma/client';
import { dbRepository, DevelopmentRepository } from './memory-store';

declare global {
  // eslint-disable-next-line no-var
  var __prismaClient: PrismaClient | undefined;
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

export { dbRepository, DevelopmentRepository };
