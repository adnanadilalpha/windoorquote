"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import {
  ANALYTICS_EVENTS,
  type AnalyticsEventName,
} from "@/lib/analytics/event-types";
import { trackAnalyticsEvent } from "@/lib/analytics/track-client";
import { safeHref } from "@/lib/security/safe-url";

type Props = {
  href: string;
  eventName?: AnalyticsEventName;
  label?: string;
  fallbackHref?: string;
  children: ReactNode;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "onClick">;

/** Anchor that records a first-party analytics event without blocking navigation. */
export function TrackedLink({
  href,
  eventName = ANALYTICS_EVENTS.NAV_CLICK,
  label,
  fallbackHref = "#",
  children,
  ...rest
}: Props) {
  const safe = safeHref(href, fallbackHref);

  return (
    <a
      {...rest}
      href={safe}
      onClick={() => {
        void trackAnalyticsEvent(eventName, {
          label,
          metadata: { href: safe },
        });
      }}
    >
      {children}
    </a>
  );
}
