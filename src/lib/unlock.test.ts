import { describe, expect, it } from "vitest";
import { isLeadLockedByOtherBroker } from "./unlock";

describe("isLeadLockedByOtherBroker", () => {
  const now = new Date("2026-02-18T00:00:00.000Z");

  it("returns false when lead has no lock", () => {
    expect(
      isLeadLockedByOtherBroker({
        lockedByBrokerId: null,
        currentBrokerId: "broker-a",
        lockExpiresAt: null,
        now,
      }),
    ).toBe(false);
  });

  it("returns false when lock belongs to current broker", () => {
    expect(
      isLeadLockedByOtherBroker({
        lockedByBrokerId: "broker-a",
        currentBrokerId: "broker-a",
        lockExpiresAt: "2026-02-18T00:05:00.000Z",
        now,
      }),
    ).toBe(false);
  });

  it("returns false when lock by another broker is expired", () => {
    expect(
      isLeadLockedByOtherBroker({
        lockedByBrokerId: "broker-b",
        currentBrokerId: "broker-a",
        lockExpiresAt: "2026-02-17T23:59:59.000Z",
        now,
      }),
    ).toBe(false);
  });

  it("returns true when lock by another broker is active", () => {
    expect(
      isLeadLockedByOtherBroker({
        lockedByBrokerId: "broker-b",
        currentBrokerId: "broker-a",
        lockExpiresAt: "2026-02-18T00:05:00.000Z",
        now,
      }),
    ).toBe(true);
  });

  it("returns false when locked by another broker but lock_expires_at is null (unlocked lead)", () => {
    expect(
      isLeadLockedByOtherBroker({
        lockedByBrokerId: "broker-b",
        currentBrokerId: "broker-a",
        lockExpiresAt: null,
        now,
      }),
    ).toBe(false);
  });

  it("returns false when lock expires exactly at now (boundary - lock is expired)", () => {
    expect(
      isLeadLockedByOtherBroker({
        lockedByBrokerId: "broker-b",
        currentBrokerId: "broker-a",
        lockExpiresAt: "2026-02-18T00:00:00.000Z",
        now: new Date("2026-02-18T00:00:00.000Z"),
      }),
    ).toBe(false);
  });

  it("returns true when lock expires 1ms after now (still active)", () => {
    expect(
      isLeadLockedByOtherBroker({
        lockedByBrokerId: "broker-b",
        currentBrokerId: "broker-a",
        lockExpiresAt: "2026-02-18T00:00:00.001Z",
        now: new Date("2026-02-18T00:00:00.000Z"),
      }),
    ).toBe(true);
  });

  it("uses current time when now is not provided", () => {
    const result = isLeadLockedByOtherBroker({
      lockedByBrokerId: "broker-b",
      currentBrokerId: "broker-a",
      lockExpiresAt: new Date(Date.now() + 60000).toISOString(),
    });
    expect(result).toBe(true);
  });
});
