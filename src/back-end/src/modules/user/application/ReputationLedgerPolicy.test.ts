import {
  canApplyReputationDelta,
  canReverseAutomaticReputationEvent,
} from "./ReputationLedgerPolicy";

describe("ReputationLedgerPolicy", () => {
  it("never permits a Creator or Contributor balance below zero", () => {
    expect(canApplyReputationDelta(8, -8)).toBe(true);
    expect(canApplyReputationDelta(8, -9)).toBe(false);
    expect(canApplyReputationDelta(0, -1)).toBe(false);
    expect(canApplyReputationDelta(8, 4)).toBe(true);
  });

  it("allows a compensating reversal only once for positive automatic XP", () => {
    expect(canReverseAutomaticReputationEvent("POSTMARK_APPLIED", 5, false)).toBe(true);
    expect(canReverseAutomaticReputationEvent("ADMIN_ADJUSTMENT", 5, false)).toBe(false);
    expect(canReverseAutomaticReputationEvent("PROJECT_PUBLISHED", -3, false)).toBe(false);
    expect(canReverseAutomaticReputationEvent("PROJECT_PUBLISHED", 3, true)).toBe(false);
  });
});
