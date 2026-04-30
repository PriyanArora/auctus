import Link from "next/link";
import { Plus, Search } from "lucide-react";
import Button from "@/components/ui/Button";
import ThreadCard from "@/components/forum/ThreadCard";
import { FORUM_CATEGORIES, listThreads } from "@/lib/forum/queries";

type SearchParams = Promise<{ category?: string; search?: string }>;

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export default async function ForumPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const threads = await listThreads({
    category: params.category,
    search: params.search,
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Community forum</h1>
            <p className="mt-2 text-lg text-gray-600">
              Ask questions, share funding context, and coordinate with other members.
            </p>
          </div>
          <Link href="/forum/new">
            <Button className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              New Thread
            </Button>
          </Link>
        </div>

        <form className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                name="search"
                defaultValue={params.search}
                placeholder="Search threads..."
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <select
              name="category"
              defaultValue={params.category ?? ""}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 md:w-56"
            >
              <option value="">All categories</option>
              {FORUM_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <Button type="submit" variant="outline">
              Filter
            </Button>
          </div>
        </form>

        {threads.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {threads.map((thread) => (
              <ThreadCard
                key={thread.id}
                id={thread.id}
                title={thread.title}
                author={{
                  name: thread.author.display_name || "Unknown user",
                  role: thread.author.role,
                }}
                category={thread.category}
                preview={thread.content}
                tags={thread.tags}
                replyCount={thread.reply_count}
                timestamp={formatDate(thread.created_at)}
                href={`/forum/${thread.id}`}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
            <Search className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900">No threads found</h2>
            <p className="mt-2 text-gray-600">
              Start a discussion or adjust the current filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
