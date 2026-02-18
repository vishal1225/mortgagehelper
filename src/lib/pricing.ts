import type { LeadSegment } from "@/lib/leads";

export const LEAD_PRICING_AUD_CENTS: Record<LeadSegment, number> = {
  refinance: 24900,
  self_employed: 39900,
};

export function getLeadPriceLabel(segment: LeadSegment) {
  const cents = LEAD_PRICING_AUD_CENTS[segment];
  return `$${(cents / 100).toFixed(0)}`;
}
