type LockStateInput = {
  lockedByBrokerId: string | null;
  currentBrokerId: string;
  lockExpiresAt: string | null;
  now?: Date;
};

export function isLeadLockedByOtherBroker(input: LockStateInput): boolean {
  if (!input.lockedByBrokerId) return false;
  if (input.lockedByBrokerId === input.currentBrokerId) return false;
  if (!input.lockExpiresAt) return false;

  const now = input.now ?? new Date();
  return new Date(input.lockExpiresAt) > now;
}
