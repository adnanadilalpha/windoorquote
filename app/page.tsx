import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import FlowWave from "@/components/FlowWave";
import Clients from "@/components/home/Clients";
import Testimonials from "@/components/home/Testimonials";
import Team from "@/components/home/Team";
import Videos from "@/components/home/Videos";
import About from "@/components/home/About";
import Contact from "@/components/home/Contact";

export default function Home() {
  return (
    <main className="story-flow">
      <Hero />
      <FlowWave tone="brand" />
      <Features />
      <FlowWave tone="brand" />
      <Clients />
      <FlowWave tone="dark" />
      <Testimonials />
      <FlowWave tone="light" />
      <Team />
      <FlowWave tone="brand" />
      <Videos />
      <About />
      <Contact />
    </main>
  );
}
