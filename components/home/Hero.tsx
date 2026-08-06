"use client";

import Image from "next/image";
import type { HomeHero } from "@/lib/content/types";
import { mediaUrl } from "@/lib/content/media";
import { ANALYTICS_EVENTS } from "@/lib/analytics/event-types";
import { trackAnalyticsEvent } from "@/lib/analytics/track-client";
import { safeHref } from "@/lib/security/safe-url";

export default function Hero({ hero }: { hero: HomeHero }) {
  const ctaHref = safeHref(hero.cta_href, "/#contactus");
  const scrollHref = safeHref(hero.scroll_href, "#features");

  return (
    <section className="hero" aria-label="Introduction">
      <div className="hero-media media-fill" aria-hidden="true">
        <Image
          src={mediaUrl(hero.image) || "/images/hero.jpg"}
          alt=""
          fill
          priority
          sizes="100vw"
          className="hero-image"
        />
      </div>
      <div className="hero-veil" aria-hidden="true" />

      <div className="hero-inner">
        <div className="hero-copy">
          <h1 className="hero-title">{hero.title}</h1>
          <p className="hero-lead">{hero.lead}</p>
          <a
            href={ctaHref}
            className="hero-cta"
            onClick={() => {
              void trackAnalyticsEvent(ANALYTICS_EVENTS.CTA_CLICK, {
                label: hero.cta_label,
                metadata: { href: ctaHref, placement: "hero" },
              });
            }}
          >
            {hero.cta_label}
          </a>
        </div>
      </div>

      <a
        href={scrollHref}
        className="hero-scroll"
        aria-label="Continue to features"
        onClick={() => {
          void trackAnalyticsEvent(ANALYTICS_EVENTS.NAV_CLICK, {
            label: "Hero scroll",
            metadata: { href: scrollHref },
          });
        }}
      >
        <span />
      </a>
    </section>
  );
}
