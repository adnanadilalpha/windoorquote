import { aboutText } from "@/data/home";

const body = aboutText.replace(
  /^Taking the complex and making it simple\s*/i,
  "",
);

const traits = ["Fast", "Reliable", "Flexible", "Intuitive"] as const;

export default function About() {
  return (
    <section id="aboutus" className="about-mark">
      <div className="about-mark-rail" aria-hidden="true">
        <span className="about-mark-spear" />
        <span className="about-mark-place">Omaha · Nebraska</span>
        <span className="about-mark-spear" />
      </div>

      <div className="about-mark-grid">
        <aside className="about-mark-aside" aria-hidden="true">
          <p className="flow-kicker">Origin</p>

          <div className="about-mark-stack">
            <div className="about-mark-chip about-mark-chip--cloud">
              <span className="about-mark-chip-icon">
                <svg viewBox="0 0 48 32" fill="none" aria-hidden="true">
                  <path
                    d="M38.5 26H14a10 10 0 0 1-1.2-19.9A12 12 0 0 1 36.2 9.4 7.5 7.5 0 0 1 38.5 26Z"
                    stroke="currentColor"
                    strokeWidth="2.2"
                  />
                </svg>
              </span>
              <div>
                <strong>Cloud based</strong>
                <em>ERP & quoting software</em>
              </div>
            </div>

            <div className="about-mark-chip">
              <span className="about-mark-chip-icon about-mark-chip-icon--grid">
                <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
                  <rect x="4" y="4" width="14" height="14" stroke="currentColor" strokeWidth="2" />
                  <rect x="22" y="4" width="14" height="14" stroke="currentColor" strokeWidth="2" />
                  <rect x="4" y="22" width="14" height="14" stroke="currentColor" strokeWidth="2" />
                  <rect x="22" y="22" width="14" height="14" stroke="currentColor" strokeWidth="2" />
                </svg>
              </span>
              <div>
                <strong>One system</strong>
                <em>Sales through production</em>
              </div>
            </div>
          </div>

          <ul className="about-mark-traits">
            {traits.map((trait) => (
              <li key={trait}>
                <span className="about-mark-trait-dot" />
                {trait}
              </li>
            ))}
          </ul>

          <div className="about-mark-system">
            <span>Quote</span>
            <span className="about-mark-dash" />
            <span>Order</span>
            <span className="about-mark-dash" />
            <span>Produce</span>
            <span className="about-mark-dash" />
            <span>Ship</span>
          </div>
        </aside>

        <div className="about-mark-copy">
          <div className="about-mark-copy-head">
            <span className="about-mark-diamond" aria-hidden="true" />
            <h2>ABOUT US</h2>
          </div>

          <p className="about-mark-text">
            <strong>
              <em>Taking the complex and making it simple </em>
            </strong>
            {body}
          </p>
        </div>
      </div>
    </section>
  );
}
