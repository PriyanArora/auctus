import type { FundingItem } from "@contracts/funding";
import FundingCard from "./FundingCard";

export default function FundingList({
  items,
  basePath,
}: {
  items: FundingItem[];
  basePath: string;
}) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-600">
        No funding opportunities found.
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {items.map((item) => (
        <FundingCard key={item.id} item={item} href={`${basePath}/${item.id}`} />
      ))}
    </div>
  );
}
