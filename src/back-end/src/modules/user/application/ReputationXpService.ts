import type { Prisma } from "@PrismaGen/client";

export type XpAxis = "CREATOR" | "CONTRIBUTOR";

export type XpRewardEventType =
  | "PROJECT_PUBLISHED"
  | "PROJECT_VERSION_PUBLISHED"
  | "EVENT_PARTICIPATION"
  | "EVENT_THIRD_PLACE"
  | "EVENT_SECOND_PLACE"
  | "EVENT_FIRST_PLACE"
  | "POSTMARK_SENT"
  | "POSTMARK_USEFUL"
  | "POSTMARK_APPLIED"
  | "POSTMARK_CREDITED_IN_VERSION"
  | "EVENT_PROJECT_EVALUATED";

export const XP_REWARDS = Object.freeze({
  PROJECT_PUBLISHED: {
    axis: "CREATOR",
    points: 3,
  },
  PROJECT_VERSION_PUBLISHED: {
    axis: "CREATOR",
    points: 2,
  },
  EVENT_PARTICIPATION: {
    axis: "CREATOR",
    points: 3,
  },
  EVENT_THIRD_PLACE: {
    axis: "CREATOR",
    points: 25,
  },
  EVENT_SECOND_PLACE: {
    axis: "CREATOR",
    points: 40,
  },
  EVENT_FIRST_PLACE: {
    axis: "CREATOR",
    points: 70,
  },
  POSTMARK_SENT: {
    axis: "CONTRIBUTOR",
    points: 1,
  },
  POSTMARK_USEFUL: {
    axis: "CONTRIBUTOR",
    points: 2,
  },
  POSTMARK_APPLIED: {
    axis: "CONTRIBUTOR",
    points: 5,
  },
  POSTMARK_CREDITED_IN_VERSION: {
    axis: "CONTRIBUTOR",
    points: 2,
  },
  EVENT_PROJECT_EVALUATED: {
    axis: "CONTRIBUTOR",
    points: 2,
  },
} as const satisfies Record<XpRewardEventType, { axis: XpAxis; points: number }>);

export const EVENT_EVALUATION_XP_LIMIT = 5;

export type PostmarkStatusForXp = "PENDING" | "USEFUL" | "APPLIED" | "DENIED";

/**
 * A Postmark can be reclassified, but the ledger keys used by distributeXp
 * make each reward idempotent for that Postmark.
 */
export function postmarkStatusXpRewards(
  status: PostmarkStatusForXp,
): readonly XpRewardEventType[] {
  if (status === "USEFUL") return ["POSTMARK_USEFUL"];
  if (status === "APPLIED") {
    return ["POSTMARK_USEFUL", "POSTMARK_APPLIED"];
  }
  return [];
}

interface XpEventContext {
  userId: string;
  idempotencyKey: string;
  projectId?: string;
  postmarkId?: string;
  projectVersionId?: string;
  eventId?: string;
  metadata?: Prisma.InputJsonValue;
}

export type XpGrantInput = XpEventContext & (
  | { type: XpRewardEventType }
  | {
      type: "ADMIN_ADJUSTMENT";
      axis: XpAxis;
      points: number;
    }
);

export function canAwardEventEvaluationXp(awardedEvaluations: number): boolean {
  return awardedEvaluations < EVENT_EVALUATION_XP_LIMIT;
}

export function eventPlacementRewardType(rank: number): XpRewardEventType | null {
  return ({
    1: "EVENT_FIRST_PLACE",
    2: "EVENT_SECOND_PLACE",
    3: "EVENT_THIRD_PLACE",
  } as Record<number, XpRewardEventType | undefined>)[rank] ?? null;
}

export function resolveXpGrant(input: XpGrantInput): {
  axis: XpAxis;
  points: number;
} {
  if (input.type === "ADMIN_ADJUSTMENT") {
    if (!Number.isInteger(input.points) || input.points === 0) {
      throw new Error("A compensacao administrativa deve ter XP inteiro e diferente de zero.");
    }
    return { axis: input.axis, points: input.points };
  }

  const reward = XP_REWARDS[input.type];
  return { axis: reward.axis, points: reward.points };
}

export async function distributeXp(
  tx: Prisma.TransactionClient,
  input: XpGrantInput,
): Promise<void> {
  const reward = resolveXpGrant(input);

  await tx.reputationEvent.upsert({
    where: { idempotencyKey: input.idempotencyKey },
    update: {},
    create: {
      userId: input.userId,
      type: input.type,
      axis: reward.axis,
      points: reward.points,
      projectId: input.projectId,
      postmarkId: input.postmarkId,
      projectVersionId: input.projectVersionId,
      eventId: input.eventId,
      metadata: input.metadata,
      idempotencyKey: input.idempotencyKey,
    },
  });
}
