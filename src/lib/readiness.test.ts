import { describe, expect, it } from "vitest";
import {
  calculateReadinessScore,
  calculateRefinanceReadiness,
  calculateSelfEmployedReadiness,
} from "./readiness";

describe("readiness", () => {
  describe("calculateRefinanceReadiness", () => {
    it("returns Green for strong profile", () => {
      expect(
        calculateRefinanceReadiness({
          creditScoreBand: "excellent",
          depositBand: "gt20",
          incomeStable: "yes",
        }),
      ).toBe("Green");
    });

    it("returns Amber for moderate profile", () => {
      expect(
        calculateRefinanceReadiness({
          creditScoreBand: "good",
          depositBand: "10to20",
          incomeStable: "mostly",
        }),
      ).toBe("Amber");
    });

    it("returns Red for weak profile", () => {
      expect(
        calculateRefinanceReadiness({
          creditScoreBand: "poor",
          depositBand: "lt10",
          incomeStable: "no",
        }),
      ).toBe("Red");
    });
  });

  describe("calculateSelfEmployedReadiness", () => {
    it("returns Green for strong profile", () => {
      expect(
        calculateSelfEmployedReadiness({
          creditScoreBand: "excellent",
          depositBand: "gt20",
          businessYears: "3plus",
          hasTwoYearsFinancials: "yes",
        }),
      ).toBe("Green");
    });

    it("returns Amber for moderate profile", () => {
      expect(
        calculateSelfEmployedReadiness({
          creditScoreBand: "good",
          depositBand: "10to20",
          businessYears: "2to3",
          hasTwoYearsFinancials: "yes",
        }),
      ).toBe("Amber");
    });

    it("returns Red for weak profile", () => {
      expect(
        calculateSelfEmployedReadiness({
          creditScoreBand: "poor",
          depositBand: "lt10",
          businessYears: "lt1",
          hasTwoYearsFinancials: "no",
        }),
      ).toBe("Red");
    });
  });

  describe("calculateReadinessScore", () => {
    it("delegates to refinance calculator for refinance segment", () => {
      expect(
        calculateReadinessScore("refinance", {
          creditScoreBand: "excellent",
          depositBand: "gt20",
          incomeStable: "yes",
        }),
      ).toBe("Green");
    });

    it("delegates to self-employed calculator for self_employed segment", () => {
      expect(
        calculateReadinessScore("self_employed", {
          creditScoreBand: "excellent",
          depositBand: "gt20",
          businessYears: "3plus",
          hasTwoYearsFinancials: "yes",
        }),
      ).toBe("Green");
    });
  });
});
