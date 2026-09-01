export function canApplyReputationDelta(currentXp: number, points: number): boolean {
  return Number.isInteger(currentXp)
    && Number.isInteger(points)
    && currentXp + points >= 0;
}

export function canReverseAutomaticReputationEvent(
  type: string,
  points: number,
  alreadyReversed: boolean,
): boolean {
  return type !== "ADMIN_ADJUSTMENT" && points > 0 && !alreadyReversed;
}
