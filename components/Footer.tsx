"use client";

import type { FooterSettings } from "@/lib/content/types";
import { ANALYTICS_EVENTS } from "@/lib/analytics/event-types";
import { TrackedLink } from "@/components/analytics/TrackedLink";

export default function Footer({ footer }: { footer: FooterSettings }) {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <p>
          Copyright © {footer.copyright_year} -{" "}
          <TrackedLink
            href={footer.brand_href}
            fallbackHref="/"
            eventName={ANALYTICS_EVENTS.NAV_CLICK}
            label={footer.brand_name}
          >
            {footer.brand_name}
          </TrackedLink>{" "}
          -{" "}
          <TrackedLink
            href={footer.manufacturing_href}
            eventName={ANALYTICS_EVENTS.NAV_CLICK}
            label={footer.manufacturing_label}
          >
            {footer.manufacturing_label}
          </TrackedLink>
        </p>
        <div className="footer-links">
          <TrackedLink
            href={footer.privacy_href}
            fallbackHref="/privacy-policy"
            eventName={ANALYTICS_EVENTS.NAV_CLICK}
            label={footer.privacy_label}
          >
            {footer.privacy_label}
          </TrackedLink>
        </div>
      </div>
    </footer>
  );
}
