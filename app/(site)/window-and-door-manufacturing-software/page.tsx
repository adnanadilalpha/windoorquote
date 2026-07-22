import type { Metadata } from "next";
import Image from "next/image";
import Features from "@/components/home/Features";
import Testimonials from "@/components/home/Testimonials";
import FlowWave from "@/components/FlowWave";
import {
  fallbacks,
  getFeatures,
  getManufacturingCards,
  getManufacturingPartners,
  getSetting,
  getTestimonials,
} from "@/lib/content/queries";
import { mediaUrl } from "@/lib/content/media";
import type {
  HomeSectionLabels,
  ManufacturingCtas,
  ManufacturingHero,
  SiteMeta,
} from "@/lib/content/types";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getSetting<SiteMeta>(
    "manufacturing_meta",
    fallbacks.manufacturingMeta,
  );
  return { title: meta.title, description: meta.description };
}

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

type IconKey = keyof typeof pairIcons;

export default async function ManufacturingSoftwarePage() {
  const [
    hero,
    oneApp,
    cutOnce,
    ctas,
    partners,
    oneAppCards,
    cutOnceCards,
    features,
    testimonials,
    labels,
  ] = await Promise.all([
    getSetting<ManufacturingHero>(
      "manufacturing_hero",
      fallbacks.manufacturingHero,
    ),
    getSetting("manufacturing_one_app", fallbacks.manufacturingOneApp),
    getSetting("manufacturing_cut_once", fallbacks.manufacturingCutOnce),
    getSetting<ManufacturingCtas>(
      "manufacturing_ctas",
      fallbacks.manufacturingCtas,
    ),
    getManufacturingPartners(),
    getManufacturingCards("one_app"),
    getManufacturingCards("cut_once"),
    getFeatures(),
    getTestimonials(),
    getSetting<HomeSectionLabels>(
      "home_section_labels",
      fallbacks.homeSectionLabels,
    ),
  ]);

  return (
    <main className="mfg-page">
      <section className="mfg-hero">
        <div className="mfg-hero-inner">
          <div className="mfg-hero-copy">
            <h1>{hero.title}</h1>
            <p>{hero.body}</p>
            <a href="#one-app" className="mfg-btn mfg-btn--solid">
              {hero.cta}
            </a>
          </div>
          <div className="mfg-hero-art">
            <Image
              src={mediaUrl(hero.image)}
              alt=""
              width={560}
              height={420}
              priority
              className="mfg-hero-illustration"
            />
          </div>
        </div>
      </section>

      {partners.length ? (
        <section className="mfg-partners" aria-label="Partners">
          <div className="mfg-partners-inner">
            {partners.map((partner) => (
              <span key={partner.id} className="mfg-partner">
                <Image
                  src={mediaUrl(partner.logo_path)}
                  alt={partner.name}
                  width={180}
                  height={64}
                  style={{ width: "auto", height: "auto", maxHeight: 48 }}
                />
              </span>
            ))}
          </div>
        </section>
      ) : null}

      <section id="one-app" className="mfg-split mfg-split--light">
        <div className="mfg-split-inner">
          <div className="mfg-split-art">
            <Image
              src={mediaUrl(oneApp.image)}
              alt=""
              width={520}
              height={420}
              className="mfg-split-illustration"
            />
          </div>
          <div className="mfg-split-copy">
            <h2>{oneApp.title}</h2>
            <p>{oneApp.body}</p>
            <div className="mfg-split-cards">
              {oneAppCards.map((card) => (
                <article key={card.id} className="mfg-mini-card">
                  <span className="mfg-mini-icon">
                    {pairIcons[(card.icon as IconKey) in pairIcons ? (card.icon as IconKey) : "layers"]}
                  </span>
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
            <h2>{cutOnce.title}</h2>
            <p>{cutOnce.body}</p>
            <div className="mfg-split-cards">
              {cutOnceCards.map((card) => (
                <article key={card.id} className="mfg-mini-card">
                  <span className="mfg-mini-icon">
                    {pairIcons[(card.icon as IconKey) in pairIcons ? (card.icon as IconKey) : "check"]}
                  </span>
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
              src={mediaUrl(cutOnce.image)}
              alt=""
              width={520}
              height={420}
              className="mfg-split-illustration"
            />
          </div>
        </div>
      </section>

      <FlowWave tone="brand" />
      <Features features={features} labels={labels} />
      <FlowWave tone="dark" />
      <Testimonials testimonials={testimonials} labels={labels} />

      <section className="mfg-download">
        <div className="mfg-download-inner">
          <div className="mfg-download-copy">
            <h2>{ctas.videos.title}</h2>
            <p>{ctas.videos.body}</p>
            <a href={ctas.videos.href} className="mfg-btn mfg-btn--ghost">
              {ctas.videos.cta}
            </a>

            <h2 className="mfg-download-second">{ctas.contact.title}</h2>
            <p>{ctas.contact.body}</p>
            <a href={ctas.contact.href} className="mfg-btn mfg-btn--ghost">
              {ctas.contact.cta}
            </a>
          </div>
          <div className="mfg-download-phone">
            <Image
              src={mediaUrl(ctas.contact.phone_image)}
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
