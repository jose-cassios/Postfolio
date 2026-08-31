import {
  Prisma,
  ReputationAxis,
  ReputationEventType,
} from "@PrismaGen/client";

export const REPUTATION_RULES = Object.freeze({
  POSTMARK_USEFUL: { axis: ReputationAxis.CONTRIBUTOR, points: 2 },
  POSTMARK_APPLIED: { axis: ReputationAxis.CONTRIBUTOR, points: 5 },
  PROJECT_IMPROVED: { axis: ReputationAxis.CREATOR, points: 3 },
  PROJECT_VERSION_WITH_COMMUNITY_CREDIT: {
    axis: ReputationAxis.CREATOR,
    points: 2,
  },
} satisfies Record<ReputationEventType, { axis: ReputationAxis; points: number }>);

export interface ReputationEventInput {
  userId: string;
  type: ReputationEventType;
  idempotencyKey: string;
  projectId?: string;
  postmarkId?: string;
  projectVersionId?: string;
  eventId?: string;
  metadata?: Prisma.InputJsonValue;
}

export async function recordReputationEvent(
  tx: Prisma.TransactionClient,
  input: ReputationEventInput,
): Promise<void> {
  const rule = REPUTATION_RULES[input.type];
  await tx.reputationEvent.upsert({
    where: { idempotencyKey: input.idempotencyKey },
    update: {},
    create: {
      userId: input.userId,
      type: input.type,
      axis: rule.axis,
      points: rule.points,
      projectId: input.projectId,
      postmarkId: input.postmarkId,
      projectVersionId: input.projectVersionId,
      eventId: input.eventId,
      metadata: input.metadata,
      idempotencyKey: input.idempotencyKey,
    },
  });
}
