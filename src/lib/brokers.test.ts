import { describe, expect, it } from "vitest";
import {
  isBrokerSpecialty,
  isBrokerState,
  SPECIALTY_OPTIONS,
  STATE_OPTIONS,
} from "./brokers";

describe("brokers", () => {
  describe("STATE_OPTIONS", () => {
    it("includes VIC and NSW", () => {
      expect(STATE_OPTIONS).toEqual(["VIC", "NSW"]);
    });
  });

  describe("SPECIALTY_OPTIONS", () => {
    it("includes refinance and self_employed", () => {
      expect(SPECIALTY_OPTIONS).toEqual(["refinance", "self_employed"]);
    });
  });

  describe("isBrokerState", () => {
    it("returns true for VIC and NSW", () => {
      expect(isBrokerState("VIC")).toBe(true);
      expect(isBrokerState("NSW")).toBe(true);
    });

    it("returns false for invalid states", () => {
      expect(isBrokerState("QLD")).toBe(false);
      expect(isBrokerState("")).toBe(false);
      expect(isBrokerState("vic")).toBe(false);
      expect(isBrokerState("refinance")).toBe(false);
    });
  });

  describe("isBrokerSpecialty", () => {
    it("returns true for refinance and self_employed", () => {
      expect(isBrokerSpecialty("refinance")).toBe(true);
      expect(isBrokerSpecialty("self_employed")).toBe(true);
    });

    it("returns false for invalid specialties", () => {
      expect(isBrokerSpecialty("first_home")).toBe(false);
      expect(isBrokerSpecialty("")).toBe(false);
      expect(isBrokerSpecialty("Refinance")).toBe(false);
      expect(isBrokerSpecialty("VIC")).toBe(false);
    });
  });
});
