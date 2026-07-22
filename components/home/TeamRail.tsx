"use client";

import Image from "next/image";
import { useRef } from "react";
import { team } from "@/data/home";

/**
 * Backup of the previous horizontal team rail.
 * To restore: in app/page.tsx import Team from "@/components/home/TeamRail"
 */
export default function TeamRail() {
  const railRef = useRef<HTMLDivElement>(null);

  function scrollBy(dir: -1 | 1) {
    railRef.current?.scrollBy({
      left: dir * Math.min(420, window.innerWidth * 0.8),
      behavior: "smooth",
    });
  }

  return (
    <section id="employees" className="flow-section team-flow">
      <div className="team-flow-top">
        <div className="flow-section-head">
          <p className="flow-kicker">People</p>
          <h2>OUR TEAM</h2>
        </div>
        <div className="team-flow-controls">
          <button type="button" aria-label="Previous" onClick={() => scrollBy(-1)}>
            ←
          </button>
          <button type="button" aria-label="Next" onClick={() => scrollBy(1)}>
            →
          </button>
        </div>
      </div>

      <div className="team-rail" ref={railRef}>
        {team.map((member) => (
          <article key={member.name} className="team-slide">
            <div className="team-slide-photo media-fill">
              <Image
                src={member.image}
                alt={member.name}
                fill
                sizes="(max-width: 700px) 78vw, 520px"
                className="team-slide-img"
              />
            </div>
            <div className="team-slide-copy">
              <h3>{member.name}</h3>
              <h4>{member.role}</h4>
              <p>{member.bio}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
