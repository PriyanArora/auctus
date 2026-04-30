import type { RoutePolicyRegistry } from "@contracts/route-policy";

export const fundingPolicies: RoutePolicyRegistry = [
  { path: "/grants", allowed_roles: ["business"], require_auth: true },
  { path: "/scholarships", allowed_roles: ["student"], require_auth: true },
  {
    path: "/research-funding",
    allowed_roles: ["professor"],
    require_auth: true,
  },
];
