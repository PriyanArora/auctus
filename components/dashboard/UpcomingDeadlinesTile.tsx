import Link from "next/link";
import type { FundingSummary } from "@contracts/funding";
import Card from "@/components/ui/Card";
import { NO_UPCOMING_DEADLINES_TEXT } from "@/lib/dashboard/composer";

function formatDeadline(value: string | null): string {
  if (!value) return "Rolling";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function UpcomingDeadlinesTile({
  items,
  fundingHomeRoute,
}: {
  items: FundingSummary[];
  fundingHomeRoute: string;
}) {
  return (
    <Card
      className="border border-gray-200"
      header={<h2 className="text-lg font-semibold">Upcoming deadlines</h2>}
    >
      {items.length === 0 ? (
        <div className="space-y-3">
          <p className="text-sm text-gray-600">{NO_UPCOMING_DEADLINES_TEXT}</p>
          <Link
            href={fundingHomeRoute}
            className="text-sm font-medium text-primary-600 hover:underline"
          >
            Browse funding
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id} className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-600">{item.provider}</p>
              </div>
              <span className="text-sm text-gray-600">{formatDeadline(item.deadline)}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
