import type { Metadata } from "next";
import Image from "next/image";
import Features from "@/components/home/Features";
import Testimonials from "@/components/home/Testimonials";
import ContactForm from "@/components/home/ContactForm";
import GeoFaq from "@/components/home/GeoFaq";
import FlowWave from "@/components/FlowWave";
import JsonLd from "@/components/JsonLd";
import {
  fallbacks,
  getFeatures,
  getManufacturingCards,
  getManufacturingPartners,
  getSetting,
  getTestimonials,
} from "@/lib/content/queries";
import { mediaUrl } from "@/lib/content/media";
import { ANALYTICS_EVENTS } from "@/lib/analytics/event-types";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { faqJsonLd, softwareApplicationJsonLd } from "@/lib/seo";
import { buildPageMetadata } from "@/lib/seo/page-metadata";
import type {
  HomeContact,
  HomeFaq,
  HomeSectionLabels,
  ManufacturingCtas,
  ManufacturingHero,
  SiteMeta,
} from "@/lib/content/types";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getSetting<SiteMeta>(
    "manufacturing_meta",
    fallbacks.manufacturingMeta,
  );
  return buildPageMetadata({
    title: meta.title,
    description: meta.description,
    path: "/window-and-door-manufacturing-software",
  });
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
    faq,
    contact,
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
    getSetting<HomeFaq>("home_faq", fallbacks.homeFaq),
    getSetting<HomeContact>("home_contact", fallbacks.homeContact),
  ]);

  return (
    <main className="mfg-page">
      <JsonLd data={[softwareApplicationJsonLd(), faqJsonLd(faq.items)]} />
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
              alt="WinDoor Quote window and door manufacturing software illustration"
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
              alt="All-in-one WinDoor Quote app for manufacturers"
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
              alt="Precise CNC cut parameters in WinDoor Quote"
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
            <TrackedLink
              href={ctas.videos.href}
              fallbackHref="/#demos"
              eventName={ANALYTICS_EVENTS.CTA_CLICK}
              label={ctas.videos.cta}
              className="mfg-btn mfg-btn--ghost"
            >
              {ctas.videos.cta}
            </TrackedLink>

            <h2 className="mfg-download-second">{ctas.contact.title}</h2>
            <p>{ctas.contact.body}</p>
            <TrackedLink
              href="#contactus"
              fallbackHref="#contactus"
              eventName={ANALYTICS_EVENTS.CTA_CLICK}
              label={ctas.contact.cta}
              className="mfg-btn mfg-btn--ghost"
            >
              {ctas.contact.cta}
            </TrackedLink>
          </div>
          <div className="mfg-download-phone">
            <Image
              src={mediaUrl(ctas.contact.phone_image)}
              alt="WinDoor Quote mobile quoting app on a phone"
              width={320}
              height={520}
              className="mfg-phone-art"
            />
          </div>
        </div>
      </section>

      <GeoFaq faq={faq} />

      <section id="contactus" className="mfg-contact">
        <div className="mfg-contact-inner">
          <div className="mfg-contact-head">
            <p className="mfg-contact-kicker">{contact.kicker}</p>
            <h2>{contact.title}</h2>
            <p>{contact.body}</p>
          </div>
          <div className="contact-desk-form-head">
            <p>{contact.form_heading}</p>
          </div>
          <ContactForm
            submitLabel={contact.submit_label}
            hint={contact.hint}
            successMessage={contact.success_message}
            showHint
            sourcePage="/window-and-door-manufacturing-software"
          />
        </div>
      </section>
    </main>
  );
}
