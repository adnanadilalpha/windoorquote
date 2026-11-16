import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import FlowWave from "@/components/FlowWave";
import Clients from "@/components/home/Clients";
import Testimonials from "@/components/home/Testimonials";
import Team from "@/components/home/Team";
import Videos from "@/components/home/Videos";
import About from "@/components/home/About";
import GeoFaq from "@/components/home/GeoFaq";
import Contact from "@/components/home/Contact";
import JsonLd from "@/components/JsonLd";
import {
  fallbacks,
  getClients,
  getFeatures,
  getSetting,
  getTeamMembers,
  getTestimonials,
  getVideos,
} from "@/lib/content/queries";
import { faqJsonLd, softwareApplicationJsonLd } from "@/lib/seo";
import { buildPageMetadata } from "@/lib/seo/page-metadata";
import type {
  HomeAbout,
  HomeContact,
  HomeFaq,
  HomeHero,
  HomeSectionLabels,
  SiteMeta,
} from "@/lib/content/types";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getSetting<SiteMeta>("site_meta", fallbacks.siteMeta);
  return buildPageMetadata({
    title: meta.title,
    description: meta.description,
    path: "/",
  });
}

export default async function Home() {
  const [
    hero,
    about,
    faq,
    contact,
    labels,
    features,
    clients,
    testimonials,
    team,
    videos,
  ] = await Promise.all([
    getSetting<HomeHero>("home_hero", fallbacks.homeHero),
    getSetting<HomeAbout>("home_about", fallbacks.homeAbout),
    getSetting<HomeFaq>("home_faq", fallbacks.homeFaq),
    getSetting<HomeContact>("home_contact", fallbacks.homeContact),
    getSetting<HomeSectionLabels>(
      "home_section_labels",
      fallbacks.homeSectionLabels,
    ),
    getFeatures(),
    getClients(),
    getTestimonials(),
    getTeamMembers(),
    getVideos(),
  ]);

  return (
    <main className="story-flow">
      <JsonLd data={[softwareApplicationJsonLd(), faqJsonLd(faq.items)]} />
      <Hero hero={hero} />
      <FlowWave tone="brand" />
      <Features features={features} labels={labels} />
      <FlowWave tone="brand" />
      <Clients clients={clients} labels={labels} />
      <FlowWave tone="dark" />
      <Testimonials testimonials={testimonials} labels={labels} />
      <FlowWave tone="light" />
      <Team team={team} labels={labels} />
      <FlowWave tone="brand" />
      <Videos videos={videos} labels={labels} />
      <About about={about} />
      <GeoFaq faq={faq} />
      <Contact contact={contact} />
    </main>
  );
}
