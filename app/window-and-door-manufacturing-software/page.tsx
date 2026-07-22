import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Features from "@/components/home/Features";
import Testimonials from "@/components/home/Testimonials";
import FlowWave from "@/components/FlowWave";
import {
  manufacturingContactCta,
  manufacturingCutOnce,
  manufacturingHero,
  manufacturingMeta,
  manufacturingOneApp,
  manufacturingPartners,
  manufacturingVideosCta,
} from "@/data/manufacturing";

export const metadata: Metadata = {
  title: manufacturingMeta.title,
  description: manufacturingMeta.description,
};

const pairIcons = {
  layers: (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <rect x="10" y="14" width="28" height="20" rx="2" stroke="currentColor" strokeWidth="2.5" />
      <path d="M16 20h16M16 26h10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  spark: (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path
        d="M24 8c1.2 7 8 13.8 16 16-8 2.2-14.8 9-16 16-1.2-7-8-13.8-16-16 8-2.2 14.8-9 16-16Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  ),
  sliders: (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M24 12v24M12 24h24M16 16l16 16M32 16 16 32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <circle cx="24" cy="24" r="14" stroke="currentColor" strokeWidth="2.5" />
      <path d="M24 16v10M20 30h8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
} as const;

export default function ManufacturingSoftwarePage() {
  return (
    <main className="mfg-page">
      <section className="mfg-hero">
        <div className="mfg-hero-inner">
          <div className="mfg-hero-copy">
            <h1>{manufacturingHero.title}</h1>
            <p>{manufacturingHero.body}</p>
            <a href="#one-app" className="mfg-btn mfg-btn--solid">
              {manufacturingHero.cta}
            </a>
          </div>
          <div className="mfg-hero-art">
            <Image
              src={manufacturingHero.image}
              alt=""
              width={560}
              height={420}
              priority
              className="mfg-hero-illustration"
            />
          </div>
        </div>
      </section>

      <section className="mfg-partners" aria-label="Partners">
        <div className="mfg-partners-inner">
          {manufacturingPartners.map((partner) => (
            <span key={partner.name} className="mfg-partner">
              <Image
                src={partner.src}
                alt={partner.name}
                width={180}
                height={64}
              />
            </span>
          ))}
        </div>
      </section>

      <section id="one-app" className="mfg-split mfg-split--light">
        <div className="mfg-split-inner">
          <div className="mfg-split-art">
            <Image
              src={manufacturingOneApp.image}
              alt=""
              width={520}
              height={420}
              className="mfg-split-illustration"
            />
          </div>
          <div className="mfg-split-copy">
            <h2>{manufacturingOneApp.title}</h2>
            <p>{manufacturingOneApp.body}</p>
            <div className="mfg-split-cards">
              {manufacturingOneApp.cards.map((card) => (
                <article key={card.title} className="mfg-mini-card">
                  <span className="mfg-mini-icon">{pairIcons[card.icon]}</span>
                  <div>
                    <h3>{card.title}</h3>
                    <p>{card.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mfg-split mfg-split--tint">
        <div className="mfg-split-inner mfg-split-inner--reverse">
          <div className="mfg-split-copy">
            <h2>{manufacturingCutOnce.title}</h2>
            <p>{manufacturingCutOnce.body}</p>
            <div className="mfg-split-cards">
              {manufacturingCutOnce.cards.map((card) => (
                <article key={card.title} className="mfg-mini-card">
                  <span className="mfg-mini-icon">{pairIcons[card.icon]}</span>
                  <div>
                    <h3>{card.title}</h3>
                    <p>{card.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <div className="mfg-split-art">
            <Image
              src={manufacturingCutOnce.image}
              alt=""
              width={520}
              height={420}
              className="mfg-split-illustration"
            />
          </div>
        </div>
      </section>

      <FlowWave tone="brand" />
      <Features />
      <FlowWave tone="dark" />
      <Testimonials />

      <section className="mfg-download">
        <div className="mfg-download-inner">
          <div className="mfg-download-copy">
            <h2>{manufacturingVideosCta.title}</h2>
            <p>{manufacturingVideosCta.body}</p>
            <a href={manufacturingVideosCta.href} className="mfg-btn mfg-btn--ghost">
              {manufacturingVideosCta.cta}
            </a>

            <h2 className="mfg-download-second">{manufacturingContactCta.title}</h2>
            <p>{manufacturingContactCta.body}</p>
            <a href={manufacturingContactCta.href} className="mfg-btn mfg-btn--ghost">
              {manufacturingContactCta.cta}
            </a>
          </div>
          <div className="mfg-download-phone">
            <Image
              src={manufacturingContactCta.phoneImage}
              alt=""
              width={320}
              height={520}
              className="mfg-phone-art"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
