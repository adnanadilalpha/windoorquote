"use client";

import Image from "next/image";
import type { HomeHero } from "@/lib/content/types";
import { mediaUrl } from "@/lib/content/media";

export default function Hero({ hero }: { hero: HomeHero }) {
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
          <a href={hero.cta_href} className="hero-cta">
            {hero.cta_label}
          </a>
        </div>
      </div>

      <a
        href={hero.scroll_href}
        className="hero-scroll"
        aria-label="Continue to features"
      >
        <span />
      </a>
    </section>
  );
}
