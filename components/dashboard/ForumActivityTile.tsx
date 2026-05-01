import Link from "next/link";
import Card from "@/components/ui/Card";
import type { ForumThread } from "@/lib/forum/queries";

function formatTimestamp(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ForumActivityTile({ threads }: { threads: ForumThread[] }) {
  return (
    <Card
      className="border border-gray-200"
      header={<h2 className="text-xl font-bold text-gray-900">Recent forum activity</h2>}
    >
      {threads.length === 0 ? (
        <div className="space-y-3">
          <p className="text-sm text-gray-600">No forum activity yet.</p>
          <Link
            href="/forum/new"
            className="text-sm font-medium text-primary-600 hover:underline"
          >
            Start a thread
          </Link>
        </div>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {threads.map((thread) => (
            <li key={thread.id} className="rounded-lg border border-gray-100 bg-gray-50 p-4">
              <Link
                href={`/forum/${thread.id}`}
                className="font-medium text-gray-900 hover:underline"
              >
                {thread.title}
              </Link>
              <div className="mt-1 flex items-center gap-3 text-xs text-gray-600">
                <span>{thread.author?.display_name ?? "Unknown"}</span>
                <span>{thread.category}</span>
                <span>
                  {thread.reply_count} repl{thread.reply_count === 1 ? "y" : "ies"}
                </span>
                <span>{formatTimestamp(thread.updated_at ?? thread.created_at)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
