import Link from "next/link";
import type { FundingItem } from "@contracts/funding";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

function formatAmount(item: FundingItem) {
  if (item.amount_min && item.amount_max) {
    return `$${item.amount_min.toLocaleString()} - $${item.amount_max.toLocaleString()}`;
  }

  if (item.amount_max) {
    return `Up to $${item.amount_max.toLocaleString()}`;
  }

  return "Amount varies";
}

function formatDeadline(deadline: string | null) {
  if (!deadline) return "Rolling deadline";

  return new Intl.DateTimeFormat("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(deadline));
}

export default function FundingCard({
  item,
  href,
}: {
  item: FundingItem;
  href: string;
}) {
  return (
    <Card className="border border-gray-200">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {item.category && <Badge color="gray">{item.category}</Badge>}
          <Badge variant="success">{formatDeadline(item.deadline)}</Badge>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900">{item.name}</h2>
          <p className="mt-1 text-sm text-gray-600">{item.provider}</p>
        </div>

        {item.description && (
          <p className="line-clamp-3 text-sm text-gray-700">
            {item.description}
          </p>
        )}

        <div className="flex items-center justify-between gap-4">
          <span className="text-sm font-semibold text-gray-900">
            {formatAmount(item)}
          </span>
          <Link href={href}>
            <Button size="sm" variant="outline">
              View
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
