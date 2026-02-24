"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

type BrokerLeadDetailTrackerProps = {
  leadId: string;
  segment: "refinance" | "self_employed";
  state: "VIC" | "NSW";
  readinessScore: "Green" | "Amber" | "Red";
  unlockSuccess?: boolean;
};

export function BrokerLeadDetailTracker({
  leadId,
  segment,
  state,
  readinessScore,
  unlockSuccess = false,
}: BrokerLeadDetailTrackerProps) {
  useEffect(() => {
    trackEvent("broker_lead_view", {
      lead_id: leadId,
      segment,
      state,
      readiness_score: readinessScore,
    });

    if (unlockSuccess) {
      trackEvent("broker_unlock_success", { lead_id: leadId, segment });
    }
  }, [leadId, readinessScore, segment, state, unlockSuccess]);

  return null;
}
