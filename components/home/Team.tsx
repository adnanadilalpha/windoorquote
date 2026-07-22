"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useState,
  type CSSProperties,
  type MouseEvent,
} from "react";
import type { HomeSectionLabels, TeamMember } from "@/lib/content/types";
import { mediaUrl } from "@/lib/content/media";

type Props = {
  team: TeamMember[];
  labels: Pick<HomeSectionLabels, "team_title">;
};

export default function Team({ team, labels }: Props) {
  const [open, setOpen] = useState(0);
  const [mx, setMx] = useState(0.5);

  const onMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia("(max-width: 980px)").matches) return;
    if (!window.matchMedia("(hover: hover)").matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setMx((e.clientX - rect.left) / rect.width);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (window.matchMedia("(max-width: 980px)").matches) return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setOpen((i) => (i + 1) % team.length);
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setOpen((i) => (i - 1 + team.length) % team.length);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [team.length]);

  if (!team.length) return null;

  return (
    <section id="employees" className="team-doors">
      <header className="team-doors-head">
        <h2>{labels.team_title}</h2>
      </header>

      <div
        className="team-doors-wall"
        onMouseMove={onMove}
        style={{ "--mx": mx } as CSSProperties}
        role="list"
        aria-label="Team members"
      >
        {team.map((person, index) => {
          const isOpen = open === index;
          return (
            <div key={person.id} className="team-door-block" role="listitem">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`team-dossier-${person.id}`}
                className={`team-door${isOpen ? " is-open" : ""}`}
                onMouseEnter={() => {
                  if (
                    window.matchMedia("(max-width: 980px)").matches ||
                    !window.matchMedia("(hover: hover)").matches
                  ) {
                    return;
                  }
                  setOpen(index);
                }}
                onFocus={() => {
                  if (window.matchMedia("(max-width: 980px)").matches) return;
                  setOpen(index);
                }}
                onClick={() => {
                  if (window.matchMedia("(max-width: 980px)").matches) return;
                  setOpen(index);
                }}
              >
                <span className="team-door-pane media-fill">
                  <Image
                    src={mediaUrl(person.image_path)}
                    alt={person.name}
                    fill
                    sizes="(max-width: 980px) 90vw, 55vw"
                    className="team-door-photo"
                    priority={index < 2}
                  />
                  <span className="team-door-shade" aria-hidden="true" />
                </span>

                <span className="team-door-edge" aria-hidden="true">
                  <span>{person.name}</span>
                </span>

                <span className="team-door-tag">
                  <strong>{person.name}</strong>
                  <span>{person.role}</span>
                </span>
              </button>

              <div
                id={`team-dossier-${person.id}`}
                className={`team-dossier${isOpen ? " is-active" : ""}`}
                aria-label={`${person.name}, ${person.role}`}
              >
                <div className="team-dossier-meta">
                  <p className="team-dossier-role">{person.role}</p>
                  <h3>{person.name}</h3>
                </div>
                <p className="team-dossier-bio">{person.bio}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
