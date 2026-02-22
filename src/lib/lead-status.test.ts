import { describe, expect, it } from "vitest";
import {
  isLeadStatus,
  LEAD_STATUS_OPTIONS,
} from "./lead-status";

describe("lead-status", () => {
  describe("LEAD_STATUS_OPTIONS", () => {
    it("includes all required statuses", () => {
      expect(LEAD_STATUS_OPTIONS).toEqual([
        "Contacted",
        "Submitted",
        "Lost",
        "Not eligible",
      ]);
    });
  });

  describe("isLeadStatus", () => {
    it("returns true for valid statuses", () => {
      expect(isLeadStatus("Contacted")).toBe(true);
      expect(isLeadStatus("Submitted")).toBe(true);
      expect(isLeadStatus("Lost")).toBe(true);
      expect(isLeadStatus("Not eligible")).toBe(true);
    });

    it("returns false for invalid statuses", () => {
      expect(isLeadStatus("")).toBe(false);
      expect(isLeadStatus("contacted")).toBe(false);
      expect(isLeadStatus("Pending")).toBe(false);
      expect(isLeadStatus("Won")).toBe(false);
    });
  });
});
