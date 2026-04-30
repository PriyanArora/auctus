import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { ROLE_DEFAULT_ROUTE, type Role } from "@contracts/role";

describe("contract imports", () => {
  it("imports a contract type through @contracts", () => {
    const role: Role = "business";

    expect(ROLE_DEFAULT_ROUTE[role]).toBe("/grants");
  });

  it("keeps all contract files locked", () => {
    const contractFiles = [
      "role.ts",
      "route-policy.ts",
      "profile.ts",
      "session.ts",
      "funding.ts",
    ];

    for (const file of contractFiles) {
      const source = readFileSync(
        path.join(process.cwd(), "build/contracts", file),
        "utf8",
      );

      expect(source.startsWith("// STATUS: LOCKED")).toBe(true);
    }
  });
});
