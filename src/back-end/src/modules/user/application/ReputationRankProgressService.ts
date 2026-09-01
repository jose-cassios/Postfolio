import { ReputationRank } from "@PrismaGen/client";
import {
  REPUTATION_RANKS,
  ReputationRankLabel,
  ReputationRankThreshold,
} from "@user/application/ReputationRanks";
import { ReputationRankProgressContract } from "@shared/contracts/UserContracts";

export type ReputationRankAxis = "CREATOR" | "CONTRIBUTOR";

export interface ReputationRankMissionEvidence {
  publishedProjects: number;
  newVersions: number;
  eventParticipations: number;
  topThreeFinishes: number;
  eventWins: number;
  postmarksSent: number;
  usefulFeedbacks: number;
  appliedSuggestions: number;
  validEventEvaluations: number;
}

type MissionMetric = keyof ReputationRankMissionEvidence;

interface RankMission {
  label: string;
  metric: MissionMetric;
  requiredValue: number;
}

const CREATOR_MISSIONS: Readonly<Partial<Record<ReputationRankLabel, RankMission>>> = {
  "F+": { label: "Publique 1 projeto", metric: "publishedProjects", requiredValue: 1 },
  E: { label: "Publique 3 projetos", metric: "publishedProjects", requiredValue: 3 },
  "E+": { label: "Crie 2 novas versões", metric: "newVersions", requiredValue: 2 },
  D: { label: "Publique 5 projetos", metric: "publishedProjects", requiredValue: 5 },
  "D+": { label: "Crie 5 novas versões", metric: "newVersions", requiredValue: 5 },
  C: { label: "Participe de 3 eventos", metric: "eventParticipations", requiredValue: 3 },
  "C+": { label: "Crie 10 novas versões", metric: "newVersions", requiredValue: 10 },
  B: { label: "Publique 10 projetos", metric: "publishedProjects", requiredValue: 10 },
  "B+": { label: "Fique no Top 3 em 1 evento", metric: "topThreeFinishes", requiredValue: 1 },
  A: { label: "Publique 20 projetos", metric: "publishedProjects", requiredValue: 20 },
  "A+": { label: "Crie 20 novas versões", metric: "newVersions", requiredValue: 20 },
  S: { label: "Vença 1 evento", metric: "eventWins", requiredValue: 1 },
  SS: { label: "Vença 3 eventos", metric: "eventWins", requiredValue: 3 },
};

const CONTRIBUTOR_MISSIONS: Readonly<Partial<Record<ReputationRankLabel, RankMission>>> = {
  "F+": { label: "Envie 3 Postmarks", metric: "postmarksSent", requiredValue: 3 },
  E: { label: "Tenha 5 Postmarks úteis", metric: "usefulFeedbacks", requiredValue: 5 },
  "E+": { label: "Envie 10 Postmarks", metric: "postmarksSent", requiredValue: 10 },
  D: { label: "Tenha 10 Postmarks úteis", metric: "usefulFeedbacks", requiredValue: 10 },
  "D+": { label: "Tenha 5 Postmarks aplicados", metric: "appliedSuggestions", requiredValue: 5 },
  C: { label: "Tenha 25 Postmarks úteis", metric: "usefulFeedbacks", requiredValue: 25 },
  "C+": { label: "Tenha 15 Postmarks aplicados", metric: "appliedSuggestions", requiredValue: 15 },
  B: { label: "Faça 25 avaliações válidas em eventos", metric: "validEventEvaluations", requiredValue: 25 },
  "B+": { label: "Tenha 30 Postmarks aplicados", metric: "appliedSuggestions", requiredValue: 30 },
  A: { label: "Tenha 75 Postmarks úteis", metric: "usefulFeedbacks", requiredValue: 75 },
  "A+": { label: "Tenha 50 Postmarks aplicados", metric: "appliedSuggestions", requiredValue: 50 },
  S: { label: "Tenha 100 Postmarks aplicados", metric: "appliedSuggestions", requiredValue: 100 },
  SS: { label: "Tenha 200 Postmarks aplicados", metric: "appliedSuggestions", requiredValue: 200 },
};

const missionsByAxis: Record<ReputationRankAxis, Readonly<Partial<Record<ReputationRankLabel, RankMission>>>> = {
  CREATOR: CREATOR_MISSIONS,
  CONTRIBUTOR: CONTRIBUTOR_MISSIONS,
};

function clampPercent(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function requiredXpFor(
  rank: ReputationRank,
  thresholds: readonly ReputationRankThreshold[],
): number {
  const threshold = thresholds.find((item) => item.rank === rank);
  if (!threshold) {
    throw new Error(`A configuração de XP para o rank ${rank} não existe.`);
  }
  return threshold.requiredXp;
}

/**
 * Resolves one axis at a time. A rank is only reached after every prior rank
 * was unlocked by both its persisted XP threshold and its cumulative mission.
 */
export function resolveReputationRankProgress(
  axis: ReputationRankAxis,
  xp: number,
  thresholds: readonly ReputationRankThreshold[],
  evidence: ReputationRankMissionEvidence,
): ReputationRankProgressContract {
  const missions = missionsByAxis[axis];
  let currentIndex = 0;

  while (currentIndex < REPUTATION_RANKS.length - 1) {
    const next = REPUTATION_RANKS[currentIndex + 1];
    const mission = missions[next.label];
    if (!mission) {
      throw new Error(`A missão de ${axis} para o rank ${next.label} não existe.`);
    }
    const xpCompleted = xp >= requiredXpFor(next.value, thresholds);
    const missionCompleted = evidence[mission.metric] >= mission.requiredValue;
    if (!xpCompleted || !missionCompleted) break;
    currentIndex += 1;
  }

  const current = REPUTATION_RANKS[currentIndex];
  const next = REPUTATION_RANKS[currentIndex + 1];
  if (!next) {
    return {
      rank: current.label,
      xp,
      nextRank: null,
      xpRequired: null,
      xpRemaining: 0,
      progressPercent: 100,
      mission: null,
      missionCurrentValue: null,
      missionRequiredValue: null,
      missionCompleted: true,
    };
  }

  const mission = missions[next.label]!;
  const currentXpRequired = requiredXpFor(current.value, thresholds);
  const xpRequired = requiredXpFor(next.value, thresholds);
  const xpRange = Math.max(1, xpRequired - currentXpRequired);
  const xpPercent = ((xp - currentXpRequired) / xpRange) * 100;
  const missionCurrentValue = evidence[mission.metric];
  const missionPercent = (missionCurrentValue / mission.requiredValue) * 100;

  return {
    rank: current.label,
    xp,
    nextRank: next.label,
    xpRequired,
    xpRemaining: Math.max(0, xpRequired - xp),
    progressPercent: Math.min(clampPercent(xpPercent), clampPercent(missionPercent)),
    mission: mission.label,
    missionCurrentValue,
    missionRequiredValue: mission.requiredValue,
    missionCompleted: missionCurrentValue >= mission.requiredValue,
  };
}
