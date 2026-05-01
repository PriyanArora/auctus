import type { FundingItem } from "@contracts/funding";
import FundingCard from "./FundingCard";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Search } from "lucide-react";

export default function FundingList({
  items,
  basePath,
}: {
  items: FundingItem[];
  basePath: string;
}) {
  if (items.length === 0) {
    return (
      <Card className="border border-dashed border-gray-300 py-12 text-center">
        <Search className="mx-auto mb-4 h-12 w-12 text-gray-300" />
        <h2 className="text-lg font-semibold text-gray-900">No funding opportunities found</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-gray-600">
          Try clearing filters or searching for a broader keyword.
        </p>
        <a href="?" className="mt-5 inline-flex">
          <Button type="button" variant="outline">
            Reset filters
          </Button>
        </a>
      </Card>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {items.map((item) => (
        <FundingCard key={item.id} item={item} href={`${basePath}/${item.id}`} />
      ))}
    </div>
  );
}
