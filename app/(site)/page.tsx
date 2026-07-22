import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import FlowWave from "@/components/FlowWave";
import Clients from "@/components/home/Clients";
import Testimonials from "@/components/home/Testimonials";
import Team from "@/components/home/Team";
import Videos from "@/components/home/Videos";
import About from "@/components/home/About";
import Contact from "@/components/home/Contact";
import {
  fallbacks,
  getClients,
  getFeatures,
  getSetting,
  getTeamMembers,
  getTestimonials,
  getVideos,
} from "@/lib/content/queries";
import type {
  HomeAbout,
  HomeContact,
  HomeHero,
  HomeSectionLabels,
} from "@/lib/content/types";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [
    hero,
    about,
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
      <Contact contact={contact} />
    </main>
  );
}
