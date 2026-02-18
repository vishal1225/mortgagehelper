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
});
