import { notFound } from "next/navigation";
import FundingDetail from "@/components/funding/FundingDetail";
import { GetFundingById } from "@/lib/funding/queries";

export default async function ScholarshipDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await GetFundingById(id);

  if (!item || item.type !== "scholarship") {
    notFound();
  }

  return <FundingDetail item={item} />;
}
