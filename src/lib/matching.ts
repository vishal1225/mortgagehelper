import type { LeadSegment, LeadState } from "@/lib/leads";

type CoverageInput = {
  brokerStates: string[];
  brokerSpecialties: string[];
  leadState: LeadState;
  leadSegment: LeadSegment;
};

export function matchesBrokerCoverage(input: CoverageInput): boolean {
  return (
    input.brokerStates.includes(input.leadState) &&
    input.brokerSpecialties.includes(input.leadSegment)
  );
}
