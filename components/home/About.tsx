import type { HomeAbout } from "@/lib/content/types";

export default function About({ about }: { about: HomeAbout }) {
  const steps = about.process ?? [];

  return (
    <section id="aboutus" className="about-mark">
      <div className="about-mark-grid">
        <aside className="about-mark-aside">
          <div className="about-flow">
            <p className="about-flow-kicker">From first quote to ship date</p>
            <ol className="about-flow-list" aria-label="How WDQ works">
              {steps.map((step, i) => {
                const last = i === steps.length - 1;
                return (
                  <li key={`${step}-${i}`} className="about-flow-item">
                    <div className="about-flow-point">
                      <span
                        className={`about-flow-node${last ? " is-end" : ""}`}
                        aria-hidden="true"
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="about-flow-label">{step}</span>
                    </div>
                    {!last ? (
                      <div className="about-flow-connector" aria-hidden="true">
                        <span className="about-flow-line" />
                        <span className="about-flow-arrow" />
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ol>
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
