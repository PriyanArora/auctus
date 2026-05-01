import Link from "next/link";
import { Search, X } from "lucide-react";
import type { Role } from "@contracts/role";
import { FUNDING_FILTERS } from "@/lib/funding/filter-definitions";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export default function FundingFilters({
  role,
  search,
  category,
}: {
  role: Role;
  search?: string;
  category?: string;
}) {
  const filters = FUNDING_FILTERS[role];
  const categoryFilter = filters.find((filter) => filter.key === "category");
  const baseParams = new URLSearchParams();
  if (search) baseParams.set("search", search);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <form className="flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            aria-label="Search funding"
            name="search"
            type="search"
            defaultValue={search}
            placeholder="Search by name, provider, or keyword"
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          {category && <input type="hidden" name="category" value={category} />}
        </div>
        <Button type="submit" variant="primary" className="w-full md:w-auto">
          Search
        </Button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href={search ? `?${baseParams.toString()}` : "?"}
          className={cn(
            "rounded-full border px-3 py-1.5 text-sm font-medium transition",
            !category
              ? "border-gray-900 bg-gray-900 text-white"
              : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50",
          )}
        >
          All
        </Link>
        {categoryFilter?.options?.map((option) => {
          const params = new URLSearchParams(baseParams);
          params.set("category", option.value);
          const isActive = category === option.value;

          return (
            <Link
              key={option.value}
              href={`?${params.toString()}`}
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm font-medium transition",
                isActive
                  ? "border-gray-900 bg-gray-900 text-white shadow-sm"
                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50",
              )}
            >
              {option.label}
            </Link>
          );
        })}
        {(search || category) && (
          <Link
            href="?"
            className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            <X className="h-3.5 w-3.5" />
            Clear
          </Link>
        )}
      </div>
    </div>
  );
}
