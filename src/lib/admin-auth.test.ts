import { describe, expect, it } from "vitest";

function isAdminTokenValid(envToken: string | undefined, providedToken: string | undefined) {
  if (!envToken) return false;
  return providedToken === envToken;
}

describe("isAdminTokenValid", () => {
  it("returns false when env token is missing", () => {
    expect(isAdminTokenValid(undefined, "token")).toBe(false);
    expect(isAdminTokenValid("", "token")).toBe(false);
  });

  it("returns false when provided token is missing", () => {
    expect(isAdminTokenValid("token", undefined)).toBe(false);
  });

  it("returns true only when tokens match", () => {
    expect(isAdminTokenValid("token", "token")).toBe(true);
    expect(isAdminTokenValid("token", "other")).toBe(false);
  });
});
