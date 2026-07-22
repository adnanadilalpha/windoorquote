import type { HomeAbout } from "@/lib/content/types";

export default function About({ about }: { about: HomeAbout }) {
  const steps = about.process ?? [];

  return (
    <section id="aboutus" className="about-mark">
      <div className="about-mark-rail" aria-hidden="true">
        <span className="about-mark-spear" />
        <span className="about-mark-place">{about.location}</span>
        <span className="about-mark-spear" />
      </div>

      <div className="about-mark-grid">
        <aside className="about-mark-aside">
          <div className="about-mark-system">
            <p className="about-mark-system-kicker">From first quote to ship date</p>
            <ol className="about-mark-system-list" aria-label="How WDQ works">
              {steps.map((step, i) => (
                <li key={`${step}-${i}`} className="about-mark-step">
                  <span className="about-mark-step-ghost" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="about-mark-step-track" aria-hidden="true">
                    <span className="about-mark-step-node" />
                  </span>
                  <span className="about-mark-step-label">{step}</span>
                </li>
              ))}
            </ol>
            <div className="about-mark-system-glow" aria-hidden="true" />
          </div>
        </aside>

        <div className="about-mark-copy">
          <div className="about-mark-copy-head">
            <span className="about-mark-diamond" aria-hidden="true" />
            <h2>{about.title}</h2>
          </div>

          <p className="about-mark-text">
            <strong>
              <em>{about.mission_lead}</em>
            </strong>
            {about.body}
          </p>
        </div>
      </div>
    </section>
  );
}
