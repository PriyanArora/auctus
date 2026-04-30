import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

describe("forum and identity RLS migrations", () => {
  it("defines helpful votes through a duplicate-safe security definer function", () => {
    const sql = readFileSync(
      join(root, "supabase/migrations/0005_forum.sql"),
      "utf8",
    );

    expect(sql).toContain("security definer");
    expect(sql).toContain("on conflict do nothing");
    expect(sql).toContain("get diagnostics v_inserted = row_count");
    expect(sql).toContain("grant execute on function public.mark_reply_helpful(uuid) to authenticated");
  });

  it("blocks direct helpful-vote client writes while allowing forum reads and author writes", () => {
    const sql = readFileSync(
      join(root, "supabase/migrations/0010_rls_identity.sql"),
      "utf8",
    );

    expect(sql).toContain("alter table public.reply_helpful_votes enable row level security");
    expect(sql).not.toContain("on public.reply_helpful_votes\nfor insert");
    expect(sql).toContain("threads authenticated read");
    expect(sql).toContain("threads author insert");
    expect(sql).toContain("replies author insert");
    expect(sql).toContain("business profiles owner all");
    expect(sql).toContain("student profiles owner all");
    expect(sql).toContain("professor profiles owner all");
  });
});
