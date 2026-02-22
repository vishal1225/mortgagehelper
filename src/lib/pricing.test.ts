import { describe, expect, it } from "vitest";
import {
  getLeadPriceLabel,
  LEAD_PRICING_AUD_CENTS,
} from "./pricing";

describe("pricing", () => {
  describe("LEAD_PRICING_AUD_CENTS", () => {
    it("refinance lead is $249", () => {
      expect(LEAD_PRICING_AUD_CENTS.refinance).toBe(24900);
    });

    it("self_employed lead is $399", () => {
      expect(LEAD_PRICING_AUD_CENTS.self_employed).toBe(39900);
    });
  });

  describe("getLeadPriceLabel", () => {
    it("formats refinance price as $249", () => {
      expect(getLeadPriceLabel("refinance")).toBe("$249");
    });

    it("formats self_employed price as $399", () => {
      expect(getLeadPriceLabel("self_employed")).toBe("$399");
    });
  });
});
