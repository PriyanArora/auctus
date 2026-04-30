import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { createThread, FORUM_CATEGORIES } from "@/lib/forum/queries";

export default function NewThreadPage() {
  async function submitThread(formData: FormData) {
    "use server";

    const threadId = await createThread(formData);
    redirect(`/forum/${threadId}`);
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-3xl px-6">
        <Link
          href="/forum"
          className="mb-6 inline-flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back to forum</span>
        </Link>

        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900">Create thread</h1>
          <p className="mt-2 text-lg text-gray-600">
            Share a question, funding note, or collaboration opportunity.
          </p>
        </div>

        <Card className="border border-gray-200">
          <form action={submitThread} className="space-y-5">
            <Input
              name="title"
              label="Title"
              maxLength={120}
              required
              placeholder="What do you want to discuss?"
            />

            <label className="block text-sm font-medium text-gray-700">
              Category
              <select
                name="category"
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select a category</option>
                {FORUM_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-medium text-gray-700">
              Content
              <textarea
                name="content"
                required
                rows={10}
                placeholder="Add enough detail for others to respond usefully."
                className="mt-1 w-full resize-none rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </label>

            <Input
              name="tags"
              label="Tags"
              helperText="Optional. Separate up to five tags with commas."
              placeholder="grant, collaboration, hiring"
            />

            <div className="flex justify-end gap-3 border-t border-gray-200 pt-5">
              <Link href="/forum">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit">Post thread</Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
