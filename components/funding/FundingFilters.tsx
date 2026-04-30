import type { Role } from "@contracts/role";
import { FUNDING_FILTERS } from "@/lib/funding/filter-definitions";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

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

  return (
    <form className="grid gap-3 border-b border-gray-200 pb-5 md:grid-cols-[1fr,220px,auto]">
      <Input
        label="Search"
        name="search"
        type="search"
        defaultValue={search}
        placeholder="Search funding"
      />
      {categoryFilter?.options && (
        <Select
          label="Category"
          name="category"
          defaultValue={category ?? ""}
          options={[
            { value: "", label: "All categories" },
            ...categoryFilter.options,
          ]}
        />
      )}
      <div className="flex items-end">
        <Button type="submit" variant="primary" className="w-full md:w-auto">
          Filter
        </Button>
      </div>
    </form>
  );
}
