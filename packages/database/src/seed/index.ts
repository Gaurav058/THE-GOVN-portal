import { VERIFIED_CURRENT_JOBS_2026 } from './verified-data';
import { dbRepository } from '../memory-store';

export async function runSeed() {
  console.log(`[Seed] Initializing seed with ${VERIFIED_CURRENT_JOBS_2026.length} authentic 2026 recruitment records...`);
  dbRepository.refreshDynamicStatuses();
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
