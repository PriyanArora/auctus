import FundingFilters from "@/components/funding/FundingFilters";
import FundingList from "@/components/funding/FundingList";
import { ListFundingForRole } from "@/lib/funding/queries";

type SearchParams = Promise<{ search?: string; category?: string }>;

export default async function ResearchFundingPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const items = await ListFundingForRole({
    role: "professor",
    search: params.search,
    category: params.category,
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Research funding</h1>
            <p className="mt-2 text-lg text-gray-600">
              Research grants, equipment funds, and partnership opportunities.
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 shadow-sm">
            <span className="font-semibold text-gray-900">{items.length}</span> results
          </div>
        </div>
        <FundingFilters
          role="professor"
          search={params.search}
          category={params.category}
        />
        <div className="mt-6">
          <FundingList items={items} basePath="/research-funding" />
        </div>
      </div>
    </div>
  );
}
