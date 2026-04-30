import type { FundingItem } from "@contracts/funding";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function FundingDetail({ item }: { item: FundingItem }) {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <Card className="border border-gray-200">
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            <Badge color="gray">{item.category ?? "General"}</Badge>
            <Badge variant="success">{item.deadline ?? "Rolling deadline"}</Badge>
          </div>

          <div>
            <h1 className="text-3xl font-semibold text-gray-900">
              {item.name}
            </h1>
            <p className="mt-2 text-gray-600">{item.provider}</p>
          </div>

          {item.description && (
            <p className="text-base leading-7 text-gray-700">
              {item.description}
            </p>
          )}

          <section>
            <h2 className="text-lg font-semibold text-gray-900">
              Requirements
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-gray-700">
              {item.requirements.map((requirement) => (
                <li key={requirement}>{requirement}</li>
              ))}
            </ul>
          </section>

          {item.application_url && (
            <a href={item.application_url} target="_blank" rel="noreferrer">
              <Button variant="primary">Apply</Button>
            </a>
          )}
        </div>
      </Card>
    </div>
  );
}
