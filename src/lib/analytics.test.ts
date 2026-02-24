import { afterEach, describe, expect, it, vi } from "vitest";
import { trackEvent } from "./analytics";

const originalWindow = (globalThis as { window?: Window }).window;

afterEach(() => {
  if (originalWindow === undefined) {
    delete (globalThis as { window?: Window }).window;
  } else {
    (globalThis as { window?: Window }).window = originalWindow;
  }
  vi.restoreAllMocks();
});

describe("trackEvent", () => {
  it("does nothing when window is undefined", () => {
    delete (globalThis as { window?: Window }).window;
    expect(() => trackEvent("borrower_lead_submit")).not.toThrow();
  });

  it("uses gtag when available", () => {
    const gtag = vi.fn();
    (globalThis as { window?: Window }).window = {
      gtag,
      dataLayer: [],
    } as unknown as Window;

    trackEvent("borrower_lead_submit", { segment: "refinance" });

    expect(gtag).toHaveBeenCalledWith("event", "borrower_lead_submit", {
      segment: "refinance",
    });
    expect((globalThis as { window?: Window }).window?.dataLayer).toEqual([]);
  });

  it("falls back to dataLayer when gtag is missing", () => {
    (globalThis as { window?: Window }).window = {
      dataLayer: [],
    } as unknown as Window;

    trackEvent("broker_unlock_start", { lead_id: "lead-1", segment: "refinance" });

    const dataLayer = (globalThis as { window?: Window }).window?.dataLayer ?? [];
    expect(dataLayer).toHaveLength(1);
    expect(dataLayer[0]).toMatchObject({
      event: "broker_unlock_start",
      lead_id: "lead-1",
      segment: "refinance",
    });
  });
});
