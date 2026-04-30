import type { Role } from "@contracts/role";

export type FundingFilterDefinition = {
  key: string;
  label: string;
  type: "text" | "select";
  options?: Array<{ value: string; label: string }>;
};

export const FUNDING_FILTERS: Record<Role, FundingFilterDefinition[]> = {
  business: [
    { key: "search", label: "Search", type: "text" },
    {
      key: "category",
      label: "Category",
      type: "select",
      options: [
        { value: "Growth", label: "Growth" },
        { value: "Digital", label: "Digital" },
        { value: "Export", label: "Export" },
        { value: "Sustainability", label: "Sustainability" },
        { value: "Startup", label: "Startup" },
      ],
    },
  ],
  student: [
    { key: "search", label: "Search", type: "text" },
    {
      key: "category",
      label: "Category",
      type: "select",
      options: [
        { value: "Provincial", label: "Provincial" },
        { value: "STEM", label: "STEM" },
        { value: "Graduate", label: "Graduate" },
        { value: "Leadership", label: "Leadership" },
        { value: "Trades", label: "Trades" },
      ],
    },
  ],
  professor: [
    { key: "search", label: "Search", type: "text" },
    {
      key: "category",
      label: "Category",
      type: "select",
      options: [
        { value: "Discovery", label: "Discovery" },
        { value: "Social Sciences", label: "Social Sciences" },
        { value: "Partnership", label: "Partnership" },
        { value: "Equipment", label: "Equipment" },
        { value: "Interdisciplinary", label: "Interdisciplinary" },
      ],
    },
  ],
};
