import { redirect } from "next/navigation";
import Link from "next/link";
import { Calendar, DollarSign, MessageSquare, Target } from "lucide-react";
import { ROLE_DEFAULT_ROUTE } from "@contracts/role";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import FundingSummaryTile from "@/components/funding/FundingSummaryTile";
import UpcomingDeadlinesTile from "@/components/dashboard/UpcomingDeadlinesTile";
import ForumActivityTile from "@/components/dashboard/ForumActivityTile";
import { getSession } from "@/lib/session/get-session";
import { GetFundingSummariesForUser } from "@/lib/funding/queries";
import { listThreads } from "@/lib/forum/queries";
import { composeDashboard } from "@/lib/dashboard/composer";
import { getRoleProfile } from "@/lib/profile/queries";

export const dynamic = "force-dynamic";

const TOP_MATCHES_LIMIT = 5;
const DEADLINE_CANDIDATE_LIMIT = 30;

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect("/sign-in");
  }
  if (!session.role) {
    redirect("/onboarding");
  }

  const [fundingSummaries, threads, roleProfile] = await Promise.all([
    GetFundingSummariesForUser(session.user_id, DEADLINE_CANDIDATE_LIMIT),
    listThreads({ limit: 5 }),
    getRoleProfile(session.user_id),
  ]);

  const data = composeDashboard({
    topMatches: fundingSummaries.slice(0, TOP_MATCHES_LIMIT),
    candidateDeadlines: fundingSummaries,
    threads,
    asOf: new Date(),
  });

  const fundingHomeRoute = ROLE_DEFAULT_ROUTE[session.role];
  const displayName = roleProfile?.base.display_name ?? session.role;
  const currentDate = new Intl.DateTimeFormat("en-CA", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-6">
        <header className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Welcome back, {displayName}
            </h1>
            <p className="mt-2 flex items-center gap-2 text-lg text-gray-600">
              <Calendar className="h-5 w-5" />
              {currentDate}
            </p>
          </div>
          <Link href={fundingHomeRoute}>
            <Button className="gap-2">
              <Target className="h-4 w-4" />
              Browse matches
            </Button>
          </Link>
        </header>

        <section className="mb-8 grid gap-6 md:grid-cols-3">
          <Card className="border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-green-100 p-3">
                <DollarSign className="h-6 w-6 text-green-700" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Top matches</p>
                <p className="text-2xl font-bold text-gray-900">{data.topMatches.length}</p>
              </div>
            </div>
          </Card>
          <Card className="border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-orange-100 p-3">
                <Calendar className="h-6 w-6 text-orange-700" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Upcoming deadlines</p>
                <p className="text-2xl font-bold text-gray-900">
                  {data.upcomingDeadlines.length}
                </p>
              </div>
            </div>
          </Card>
          <Card className="border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-gray-900 p-3">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Recent threads</p>
                <p className="text-2xl font-bold text-gray-900">
                  {data.recentThreads.length}
                </p>
              </div>
            </div>
          </Card>
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <section className="lg:col-span-2">
            <FundingSummaryTile items={data.topMatches} />
          </section>
          <section>
            <UpcomingDeadlinesTile
              items={data.upcomingDeadlines}
              fundingHomeRoute={fundingHomeRoute}
            />
          </section>
          <section className="lg:col-span-3">
            <ForumActivityTile threads={data.recentThreads} />
          </section>
        </div>
      </div>
    </main>
  );
}
