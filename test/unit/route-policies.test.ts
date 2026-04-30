import { describe, expect, it } from "vitest";
import {
  combineRegistries,
  findPolicy,
  resolveRouteDecision,
} from "@/lib/auth/route-policies";
import type { RoutePolicyRegistry } from "@contracts/route-policy";

const registry: RoutePolicyRegistry = combineRegistries(
  [
    { path: "/", allowed_roles: null, require_auth: false },
    { path: "/dashboard", allowed_roles: null, require_auth: true },
    { path: "/onboarding", allowed_roles: null, require_auth: true },
  ],
  [{ path: "/grants", allowed_roles: ["business"], require_auth: true }],
);

describe("route policies", () => {
  it("sorts most specific policies first", () => {
    const policies = combineRegistries([
      { path: "/profile", allowed_roles: null, require_auth: true },
      { path: "/profile/edit", allowed_roles: null, require_auth: true },
    ]);

    expect(policies.map((policy) => policy.path)).toEqual([
      "/profile/edit",
      "/profile",
    ]);
  });

  it("matches route prefixes", () => {
    expect(findPolicy("/grants/abc", registry)?.path).toBe("/grants");
  });

  it("redirects protected routes to sign-in without a session", () => {
    expect(
      resolveRouteDecision("/dashboard", undefined, false, registry),
    ).toEqual({ action: "redirect", location: "/sign-in" });
  });

  it("redirects null-role users to onboarding", () => {
    expect(resolveRouteDecision("/dashboard", null, true, registry)).toEqual({
      action: "redirect",
      location: "/onboarding",
    });
  });

  it("redirects wrong-role users to their default route", () => {
    expect(resolveRouteDecision("/grants", "student", true, registry)).toEqual({
      action: "redirect",
      location: "/scholarships",
    });
  });

  it("allows matching roles", () => {
    expect(resolveRouteDecision("/grants", "business", true, registry)).toEqual({
      action: "allow",
    });
  });
});
