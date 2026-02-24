"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

type BrokerDashboardTrackerProps = {
  message?: string | null;
};

function getDashboardEvent(message?: string | null) {
  if (!message) return null;
  const lower = message.toLowerCase();

  if (lower.includes("checkout cancelled")) {
    return { name: "broker_unlock_cancelled" };
  }

  if (lower.includes("locked by another broker")) {
    return { name: "broker_unlock_locked" };
  }

  if (lower.includes("unlock") || lower.includes("checkout")) {
    return { name: "broker_unlock_error" };
  }

  return null;
}

export function BrokerDashboardTracker({ message }: BrokerDashboardTrackerProps) {
  useEffect(() => {
    const event = getDashboardEvent(message);
    if (!event) return;
    trackEvent(event.name);
  }, [message]);

  return null;
}
