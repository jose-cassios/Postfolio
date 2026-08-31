import { ReputationRank } from "@PrismaGen/client";

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

export interface ReputationRankThreshold {
  rank: ReputationRank;
  requiredXp: number;
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
