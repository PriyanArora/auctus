import type { FundingSummary } from "@contracts/funding";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export default function FundingSummaryTile({
  items,
}: {
  items: FundingSummary[];
}) {
  return (
    <Card
      className="h-full border border-gray-200"
      header={<h2 className="text-xl font-bold text-gray-900">Recommended for you</h2>}
    >
      {items.length === 0 ? (
        <p className="text-sm text-gray-600">No funding matches yet.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="rounded-lg border border-gray-100 bg-gray-50 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-600">{item.provider}</p>
                </div>
                <Badge
                  variant={item.match_score && item.match_score >= 70 ? "success" : "info"}
                >
                  {item.match_score === null ? "Unscored" : `${item.match_score}%`}
                </Badge>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
