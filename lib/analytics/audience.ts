import { isLikelyAutomatedView } from "@/lib/analytics/bot";
import type { PageViewRow } from "@/lib/admin/analytics";

/** Reporting-layer filter: exclude internal + likely automated junk. */
export function filterAudiencePageViews(views: PageViewRow[]): PageViewRow[] {
  return views.filter(
    (view) => !view.is_internal && !isLikelyAutomatedView(view),
  );
}

export type AnalyticsMetricKind = "user" | "session" | "event";

export const METRIC_KIND_LABELS: Record<AnalyticsMetricKind, string> = {
  user: "Unique users",
  session: "Unique sessions",
  event: "Page loads",
};
