export const LEAD_STATUS_OPTIONS = [
  "Contacted",
  "Submitted",
  "Lost",
  "Not eligible",
] as const;

export type LeadStatus = (typeof LEAD_STATUS_OPTIONS)[number];

export function isLeadStatus(value: string): value is LeadStatus {
  return LEAD_STATUS_OPTIONS.includes(value as LeadStatus);
}
