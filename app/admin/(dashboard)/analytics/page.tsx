import { AnalyticsSection } from "@/components/admin/dashboard/AnalyticsSection";
import { fetchAnalyticsDashboard } from "@/lib/admin/fetch-analytics";
import { requireAdmin } from "@/lib/auth/admin";

export default async function AnalyticsPage() {
  await requireAdmin();
  const analytics = await fetchAnalyticsDashboard();

  return (
    <div className="flex w-full flex-col gap-8">
      <header>
        <h1 className="admin-page-title">Analytics</h1>
        <p className="mt-1.5 text-sm text-body-muted">
          Here&apos;s what&apos;s happening on the public site.
        </p>
      </header>
      <AnalyticsSection initialAnalytics={analytics} />
    </div>
  );
}
