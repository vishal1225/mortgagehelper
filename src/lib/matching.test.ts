import { describe, expect, it } from "vitest";
import { matchesBrokerCoverage } from "./matching";

describe("matchesBrokerCoverage", () => {
  it("returns true when state and segment both match", () => {
    expect(
      matchesBrokerCoverage({
        brokerStates: ["VIC", "NSW"],
        brokerSpecialties: ["refinance"],
        leadState: "VIC",
        leadSegment: "refinance",
      }),
    ).toBe(true);
  });

  it("returns false when state does not match", () => {
    expect(
      matchesBrokerCoverage({
        brokerStates: ["NSW"],
        brokerSpecialties: ["refinance", "self_employed"],
        leadState: "VIC",
        leadSegment: "refinance",
      }),
    ).toBe(false);
  });

  it("returns false when specialty does not match", () => {
    expect(
      matchesBrokerCoverage({
        brokerStates: ["VIC", "NSW"],
        brokerSpecialties: ["self_employed"],
        leadState: "VIC",
        leadSegment: "refinance",
      }),
    ).toBe(false);
  });

  it("returns true when broker has single state and lead matches", () => {
    expect(
      matchesBrokerCoverage({
        brokerStates: ["VIC"],
        brokerSpecialties: ["refinance", "self_employed"],
        leadState: "VIC",
        leadSegment: "refinance",
      }),
    ).toBe(true);
  });

  it("returns false when broker has single state and lead does not match", () => {
    expect(
      matchesBrokerCoverage({
        brokerStates: ["VIC"],
        brokerSpecialties: ["refinance"],
        leadState: "NSW",
        leadSegment: "refinance",
      }),
    ).toBe(false);
  });

  it("returns true when broker has both specialties and lead matches self_employed", () => {
    expect(
      matchesBrokerCoverage({
        brokerStates: ["VIC", "NSW"],
        brokerSpecialties: ["refinance", "self_employed"],
        leadState: "NSW",
        leadSegment: "self_employed",
      }),
    ).toBe(true);
  });

  it("returns false when segment matches but state does not", () => {
    expect(
      matchesBrokerCoverage({
        brokerStates: ["VIC"],
        brokerSpecialties: ["refinance", "self_employed"],
        leadState: "NSW",
        leadSegment: "refinance",
      }),
    ).toBe(false);
  });

  it("returns false when state matches but segment does not", () => {
    expect(
      matchesBrokerCoverage({
        brokerStates: ["VIC", "NSW"],
        brokerSpecialties: ["refinance"],
        leadState: "VIC",
        leadSegment: "self_employed",
      }),
    ).toBe(false);
  });
});
