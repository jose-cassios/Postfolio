jest.mock("@PrismaGen/client", () => ({
  ReputationRank: {
    F: "F",
    F_PLUS: "F_PLUS",
    E: "E",
    E_PLUS: "E_PLUS",
    D: "D",
    D_PLUS: "D_PLUS",
    C: "C",
    C_PLUS: "C_PLUS",
    B: "B",
    B_PLUS: "B_PLUS",
    A: "A",
    A_PLUS: "A_PLUS",
    S: "S",
    SS: "SS",
  },
}));

import { ReputationRank } from "@PrismaGen/client";
import {
  ReputationRankMissionEvidence,
  resolveReputationRankProgress,
} from "./ReputationRankProgressService";
import { validateReputationRankConfig } from "./ReputationRanks";

const thresholds = [
  [ReputationRank.F, 0], [ReputationRank.F_PLUS, 20], [ReputationRank.E, 50],
  [ReputationRank.E_PLUS, 100], [ReputationRank.D, 180], [ReputationRank.D_PLUS, 300],
  [ReputationRank.C, 500], [ReputationRank.C_PLUS, 750], [ReputationRank.B, 1100],
  [ReputationRank.B_PLUS, 1550], [ReputationRank.A, 2100], [ReputationRank.A_PLUS, 2800],
  [ReputationRank.S, 3800], [ReputationRank.SS, 5000],
].map(([rank, requiredXp]) => ({ rank: rank as ReputationRank, requiredXp: requiredXp as number }));

const emptyEvidence = (): ReputationRankMissionEvidence => ({
  publishedProjects: 0,
  newVersions: 0,
  eventParticipations: 0,
  topThreeFinishes: 0,
  eventWins: 0,
  postmarksSent: 0,
  usefulFeedbacks: 0,
  appliedSuggestions: 0,
  validEventEvaluations: 0,
});

describe("ReputationRankProgressService", () => {
  it("does not promote a Creator based on XP alone", () => {
    const progress = resolveReputationRankProgress(
      "CREATOR",
      5000,
      thresholds,
      emptyEvidence(),
    );

    expect(progress).toMatchObject({
      rank: "F",
      nextRank: "F+",
      xpRequired: 20,
      mission: "Publique 1 projeto",
      missionCurrentValue: 0,
      missionRequiredValue: 1,
      missionCompleted: false,
      progressPercent: 0,
    });
  });

  it("does not promote a Creator when the mission is complete but XP is short", () => {
    const progress = resolveReputationRankProgress("CREATOR", 19, thresholds, {
      ...emptyEvidence(),
      publishedProjects: 1,
    });

    expect(progress).toMatchObject({
      rank: "F",
      nextRank: "F+",
      xpRequired: 20,
      xpRemaining: 1,
      missionCompleted: true,
      progressPercent: 95,
    });
  });

  it("advances sequentially and stops at the first incomplete Creator mission", () => {
    const evidence = {
      ...emptyEvidence(),
      publishedProjects: 10,
      newVersions: 5,
      eventParticipations: 3,
    };
    const progress = resolveReputationRankProgress("CREATOR", 1000, thresholds, evidence);

    expect(progress).toMatchObject({
      rank: "C",
      nextRank: "C+",
      xpRequired: 750,
      mission: "Crie 10 novas versões",
      missionCurrentValue: 5,
      missionRequiredValue: 10,
      missionCompleted: false,
      progressPercent: 50,
    });
  });

  it("keeps Contributor missions independent from Creator metrics", () => {
    const evidence = {
      ...emptyEvidence(),
      postmarksSent: 10,
      usefulFeedbacks: 10,
      appliedSuggestions: 0,
    };
    const progress = resolveReputationRankProgress("CONTRIBUTOR", 300, thresholds, evidence);

    expect(progress).toMatchObject({
      rank: "D",
      nextRank: "D+",
      mission: "Tenha 5 Postmarks aplicados",
      missionCurrentValue: 0,
      missionRequiredValue: 5,
      missionCompleted: false,
      progressPercent: 0,
    });
  });

  it("returns a completed terminal rank when every Creator requirement is met", () => {
    const progress = resolveReputationRankProgress("CREATOR", 5000, thresholds, {
      ...emptyEvidence(),
      publishedProjects: 20,
      newVersions: 20,
      eventParticipations: 3,
      topThreeFinishes: 1,
      eventWins: 3,
    });

    expect(progress).toEqual(expect.objectContaining({
      rank: "SS",
      nextRank: null,
      xpRequired: null,
      xpRemaining: 0,
      progressPercent: 100,
      mission: null,
      missionCompleted: true,
    }));
  });

  it("accepts a complete strictly increasing persisted rank configuration", () => {
    expect(() => validateReputationRankConfig([
      { rank: "F", requiredXp: 0 }, { rank: "F+", requiredXp: 20 },
      { rank: "E", requiredXp: 50 }, { rank: "E+", requiredXp: 100 },
      { rank: "D", requiredXp: 180 }, { rank: "D+", requiredXp: 300 },
      { rank: "C", requiredXp: 500 }, { rank: "C+", requiredXp: 750 },
      { rank: "B", requiredXp: 1100 }, { rank: "B+", requiredXp: 1550 },
      { rank: "A", requiredXp: 2100 }, { rank: "A+", requiredXp: 2800 },
      { rank: "S", requiredXp: 3800 }, { rank: "SS", requiredXp: 5000 },
    ])).not.toThrow();
  });

  it("rejects invalid persisted rank configurations even outside the HTTP form", () => {
    const invalid = [
      { rank: "F", requiredXp: 1 }, { rank: "F+", requiredXp: 20 },
      { rank: "E", requiredXp: 20 }, { rank: "E+", requiredXp: 100 },
      { rank: "D", requiredXp: 180 }, { rank: "D+", requiredXp: 300 },
      { rank: "C", requiredXp: 500 }, { rank: "C+", requiredXp: 750 },
      { rank: "B", requiredXp: 1100 }, { rank: "B+", requiredXp: 1550 },
      { rank: "A", requiredXp: 2100 }, { rank: "A+", requiredXp: 2800 },
      { rank: "S", requiredXp: 3800 }, { rank: "SS", requiredXp: 5000 },
    ] as const;

    expect(() => validateReputationRankConfig(invalid)).toThrow("rank F");
  });
});
