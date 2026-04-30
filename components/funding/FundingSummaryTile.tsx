import type { FundingSummary } from "@contracts/funding";
import Card from "@/components/ui/Card";

export default function FundingSummaryTile({
  items,
}: {
  items: FundingSummary[];
}) {
  return (
    <Card
      className="border border-gray-200"
      header={<h2 className="text-lg font-semibold">Funding matches</h2>}
    >
      {items.length === 0 ? (
        <p className="text-sm text-gray-600">No funding matches yet.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id} className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-600">{item.provider}</p>
              </div>
              <span className="text-sm text-gray-600">
                {item.match_score === null ? "Unscored" : `${item.match_score}%`}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
