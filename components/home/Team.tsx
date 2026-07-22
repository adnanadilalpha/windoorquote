"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
} from "react";
import { team } from "@/data/home";

export default function Team() {
  const [open, setOpen] = useState(0);
  const [mx, setMx] = useState(0.5);
  const dossierRef = useRef<HTMLDivElement>(null);
  const member = team[open];

  const onMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (!window.matchMedia("(hover: hover)").matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setMx((e.clientX - rect.left) / rect.width);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
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
  }, []);

  useEffect(() => {
    const narrow = window.matchMedia("(max-width: 980px)");
    if (!narrow.matches || !dossierRef.current) return;

    const frame = window.requestAnimationFrame(() => {
      dossierRef.current?.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [open]);

  return (
    <section id="employees" className="team-doors">
      <header className="team-doors-head">
        <p className="flow-kicker">People</p>
        <h2>OUR TEAM</h2>
      </header>

      <div
        className="team-doors-wall"
        onMouseMove={onMove}
        style={{ "--mx": mx } as CSSProperties}
        role="tablist"
        aria-label="Team members"
      >
        {team.map((person, index) => {
          const isOpen = open === index;
          return (
            <div key={person.name} className="team-door-block">
              <button
                type="button"
                role="tab"
                aria-selected={isOpen}
                aria-controls="team-dossier"
                className={`team-door${isOpen ? " is-open" : ""}`}
                onMouseEnter={() => {
                  if (window.matchMedia("(hover: hover)").matches) {
                    setOpen(index);
                  }
                }}
                onFocus={() => setOpen(index)}
                onClick={() => setOpen(index)}
              >
                <span className="team-door-pane media-fill">
                  <Image
                    src={person.image}
                    alt={person.name}
                    fill
                    sizes="(max-width: 900px) 90vw, 55vw"
                    className="team-door-photo"
                    priority={index === 0}
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

              {isOpen ? (
                <div
                  id="team-dossier"
                  ref={dossierRef}
                  className="team-dossier"
                  role="tabpanel"
                  aria-label={`${member.name}, ${member.role}`}
                >
                  <div className="team-dossier-meta">
                    <p className="team-dossier-role">{member.role}</p>
                    <h3>{member.name}</h3>
                  </div>
                  <p className="team-dossier-bio">{member.bio}</p>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
