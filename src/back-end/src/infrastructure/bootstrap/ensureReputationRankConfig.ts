import { prisma } from "@infrastructure/config/Prisma";
import { DEFAULT_REPUTATION_RANK_CONFIG } from "@user/application/ReputationRanks";

/**
 * Preenche somente os thresholds ausentes. Configurações já editadas por ADMIN
 * nunca são sobrescritas, inclusive em reinicializações do servidor.
 */
export async function ensureReputationRankConfig(): Promise<void> {
  await prisma.$transaction(
    DEFAULT_REPUTATION_RANK_CONFIG.map((config) =>
      prisma.reputationRankConfig.upsert({
        where: { rank: config.rank },
        create: config,
        update: {},
      }),
    ),
  );
}
