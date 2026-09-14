import { VERIFIED_CURRENT_JOBS_2026 } from './verified-data';
import { dbRepository, getPrismaClient } from '../client';
import { seedPrisma } from './seed-prisma';

export async function runSeed() {
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('placeholder')) {
    console.log('[Seed] Detected DATABASE_URL, seeding PostgreSQL via Prisma...');
    const prisma = getPrismaClient();
    await seedPrisma(prisma);
    return;
  }

  console.log(`[Seed] Initializing in-memory seed with ${VERIFIED_CURRENT_JOBS_2026.length} authentic 2026 recruitment records...`);
  if ('refreshDynamicStatuses' in dbRepository) {
    (dbRepository as any).refreshDynamicStatuses();
  }
  console.log(`[Seed] Successfully initialized repository with verified official jobs:`);
  for (const job of VERIFIED_CURRENT_JOBS_2026) {
    console.log(`  - [${job.status}] ${job.shortTitle} (${job.totalVacancies} posts) | Closes: ${job.applicationEndDate}`);
  }
}

if (require.main === module) {
  runSeed().catch((err) => {
    console.error('[Seed Error]:', err);
    process.exit(1);
  });
}
