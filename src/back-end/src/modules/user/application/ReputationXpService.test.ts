import {
  canAwardEventEvaluationXp,
  EVENT_EVALUATION_XP_LIMIT,
  postmarkStatusXpRewards,
  resolveXpGrant,
  XpAxis,
  XpGrantInput,
  XP_REWARDS,
} from "./ReputationXpService";

describe("ReputationXpService", () => {
  test.each([
    ["PROJECT_PUBLISHED", "CREATOR", 3],
    ["PROJECT_VERSION_PUBLISHED", "CREATOR", 2],
    ["EVENT_PARTICIPATION", "CREATOR", 3],
    ["EVENT_THIRD_PLACE", "CREATOR", 25],
    ["EVENT_SECOND_PLACE", "CREATOR", 40],
    ["EVENT_FIRST_PLACE", "CREATOR", 70],
    ["POSTMARK_SENT", "CONTRIBUTOR", 1],
    ["POSTMARK_USEFUL", "CONTRIBUTOR", 2],
    ["POSTMARK_APPLIED", "CONTRIBUTOR", 5],
    ["POSTMARK_CREDITED_IN_VERSION", "CONTRIBUTOR", 2],
    ["EVENT_PROJECT_EVALUATED", "CONTRIBUTOR", 2],
  ])("assigns %s to the expected axis and XP", (type, axis, points) => {
    expect(XP_REWARDS[type as keyof typeof XP_REWARDS]).toEqual({ axis, points });
  });

  it("uses the backend rule instead of any caller-provided XP", () => {
    const result = resolveXpGrant({
      userId: "user-id",
      type: "PROJECT_PUBLISHED",
      idempotencyKey: "project-published:project-id",
      axis: "CONTRIBUTOR",
      points: 999,
    } as unknown as XpGrantInput);

    expect(result).toEqual({ axis: "CREATOR", points: 3 });
  });

  it("limits event-evaluation XP to the first five valid evaluations", () => {
    expect(EVENT_EVALUATION_XP_LIMIT).toBe(5);
    expect(canAwardEventEvaluationXp(0)).toBe(true);
    expect(canAwardEventEvaluationXp(4)).toBe(true);
    expect(canAwardEventEvaluationXp(5)).toBe(false);
  });

  it("grants useful and applied XP when a pending Postmark is applied directly", () => {
    expect(postmarkStatusXpRewards("PENDING")).toEqual([]);
    expect(postmarkStatusXpRewards("DENIED")).toEqual([]);
    expect(postmarkStatusXpRewards("USEFUL")).toEqual(["POSTMARK_USEFUL"]);
    expect(postmarkStatusXpRewards("APPLIED")).toEqual([
      "POSTMARK_USEFUL",
      "POSTMARK_APPLIED",
    ]);
  });

  it("supports signed administrative adjustments and rejects zero XP", () => {
    expect(resolveXpGrant({
      userId: "user-id",
      type: "ADMIN_ADJUSTMENT",
      idempotencyKey: "admin-adjustment:penalty-1",
      axis: "CONTRIBUTOR" as XpAxis,
      points: -10,
    })).toEqual({ axis: "CONTRIBUTOR", points: -10 });

    expect(() => resolveXpGrant({
      userId: "user-id",
      type: "ADMIN_ADJUSTMENT",
      idempotencyKey: "admin-adjustment:invalid",
      axis: "CREATOR" as XpAxis,
      points: 0,
    })).toThrow("diferente de zero");
  });
});
