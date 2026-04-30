import { redirect } from "next/navigation";
import { ROLE_DEFAULT_ROUTE } from "@contracts/role";
import FundingSummaryTile from "@/components/funding/FundingSummaryTile";
import UpcomingDeadlinesTile from "@/components/dashboard/UpcomingDeadlinesTile";
import ForumActivityTile from "@/components/dashboard/ForumActivityTile";
import { getSession } from "@/lib/session/get-session";
import { GetFundingSummariesForUser } from "@/lib/funding/queries";
import { listThreads } from "@/lib/forum/queries";
import { composeDashboard } from "@/lib/dashboard/composer";

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

  const [topMatches, candidateDeadlines, threads] = await Promise.all([
    GetFundingSummariesForUser(session.user_id, TOP_MATCHES_LIMIT),
    GetFundingSummariesForUser(session.user_id, DEADLINE_CANDIDATE_LIMIT),
    listThreads(),
  ]);

  const data = composeDashboard({
    topMatches,
    candidateDeadlines,
    threads,
    asOf: new Date(),
  });

  const fundingHomeRoute = ROLE_DEFAULT_ROUTE[session.role];

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-600">
            Signed in as <span className="font-medium">{session.role}</span>.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <FundingSummaryTile items={data.topMatches} />
          </div>
          <div>
            <UpcomingDeadlinesTile
              items={data.upcomingDeadlines}
              fundingHomeRoute={fundingHomeRoute}
            />
          </div>
          <div className="lg:col-span-3">
            <ForumActivityTile threads={data.recentThreads} />
          </div>
        </div>
      </div>
    </main>
  );
}
