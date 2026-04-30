import FundingFilters from "@/components/funding/FundingFilters";
import FundingList from "@/components/funding/FundingList";
import { ListFundingForRole } from "@/lib/funding/queries";

type SearchParams = Promise<{ search?: string; category?: string }>;

export default async function GrantsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const items = await ListFundingForRole({
    role: "business",
    search: params.search,
    category: params.category,
  });

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-gray-900">Business grants</h1>
        <p className="mt-2 text-gray-600">
          Funding opportunities for business growth and operations.
        </p>
      </div>
      <FundingFilters
        role="business"
        search={params.search}
        category={params.category}
      />
      <div className="mt-6">
        <FundingList items={items} basePath="/grants" />
      </div>
    </div>
  );
}
