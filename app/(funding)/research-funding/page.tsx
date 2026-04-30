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
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-gray-900">
          Research funding
        </h1>
        <p className="mt-2 text-gray-600">
          Grants and research support for professors.
        </p>
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
  );
}
