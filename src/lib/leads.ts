export const LEAD_SEGMENTS = ["refinance", "self_employed"] as const;
export const LEAD_STATES = ["VIC", "NSW"] as const;
export const READINESS_SCORES = ["Green", "Amber", "Red"] as const;

export type LeadSegment = (typeof LEAD_SEGMENTS)[number];
export type LeadState = (typeof LEAD_STATES)[number];
export type ReadinessScore = (typeof READINESS_SCORES)[number];

export function isLeadSegment(value: string): value is LeadSegment {
  return LEAD_SEGMENTS.includes(value as LeadSegment);
}

export function isLeadState(value: string): value is LeadState {
  return LEAD_STATES.includes(value as LeadState);
}
