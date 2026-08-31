import { ReputationRank } from "@PrismaGen/client";
import { ReputationRankConfigContract } from "@shared/contracts/UserContracts";

export const REPUTATION_RANKS = [
  { value: ReputationRank.F, label: "F" },
  { value: ReputationRank.F_PLUS, label: "F+" },
  { value: ReputationRank.E, label: "E" },
  { value: ReputationRank.E_PLUS, label: "E+" },
  { value: ReputationRank.D, label: "D" },
  { value: ReputationRank.D_PLUS, label: "D+" },
  { value: ReputationRank.C, label: "C" },
  { value: ReputationRank.C_PLUS, label: "C+" },
  { value: ReputationRank.B, label: "B" },
  { value: ReputationRank.B_PLUS, label: "B+" },
  { value: ReputationRank.A, label: "A" },
  { value: ReputationRank.A_PLUS, label: "A+" },
  { value: ReputationRank.S, label: "S" },
  { value: ReputationRank.SS, label: "SS" },
] as const;

export type ReputationRankLabel = (typeof REPUTATION_RANKS)[number]["label"];

export const REPUTATION_RANK_LABELS = REPUTATION_RANKS.map((rank) => rank.label);

export interface ReputationRankThreshold {
  rank: ReputationRank;
  requiredXp: number;
}

export function reputationRankFromLabel(label: ReputationRankLabel): ReputationRank {
  const rank = REPUTATION_RANKS.find((item) => item.label === label);
  if (!rank) throw new Error(`Rank desconhecido: ${label}`);
  return rank.value;
}

export function reputationRankLabelFromValue(rank: ReputationRank): ReputationRankLabel {
  const item = REPUTATION_RANKS.find((candidate) => candidate.value === rank);
  if (!item) throw new Error(`Rank desconhecido: ${rank}`);
  return item.label;
}

/** Validates persisted thresholds independently from the HTTP form. */
export function validateReputationRankConfig(
  config: readonly ReputationRankConfigContract[],
): void {
  if (config.length !== REPUTATION_RANKS.length) {
    throw new Error("Informe todos os ranks exatamente uma vez.");
  }

  let previousXp = -1;
  for (const expected of REPUTATION_RANKS) {
    const item = config.find((candidate) => candidate.rank === expected.label);
    if (!item || !Number.isInteger(item.requiredXp) || item.requiredXp < 0) {
      throw new Error(`O XP do rank ${expected.label} deve ser um inteiro maior ou igual a zero.`);
    }
    if (expected.label === "F" && item.requiredXp !== 0) {
      throw new Error("O rank F deve permanecer com 0 XP.");
    }
    if (item.requiredXp <= previousXp) {
      throw new Error("Cada rank deve exigir mais XP que o anterior.");
    }
    previousXp = item.requiredXp;
  }
}

export function resolveReputationRank(
  xp: number,
  thresholds: readonly ReputationRankThreshold[],
): ReputationRankLabel {
  const resolved = thresholds
    .filter((threshold) => xp >= threshold.requiredXp)
    .sort((left, right) => right.requiredXp - left.requiredXp)[0]?.rank
    ?? ReputationRank.F;

  return REPUTATION_RANKS.find((rank) => rank.value === resolved)?.label ?? "F";
}
