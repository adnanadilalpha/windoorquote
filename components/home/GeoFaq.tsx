import type { HomeFaq } from "@/lib/content/types";
import { safeHref } from "@/lib/security/safe-url";

export default function GeoFaq({ faq }: { faq: HomeFaq }) {
  const items = faq.items.filter(
    (item) => item.question.trim() && item.answer.trim(),
  );
  if (items.length === 0) return null;

  const ctaHref = safeHref(faq.cta_href, "#contactus");

  return (
    <section id="faq" className="geo-faq" aria-labelledby="faq-heading">
      <div className="geo-faq-inner">
        {faq.kicker.trim() ? (
          <p className="geo-faq-kicker">{faq.kicker}</p>
        ) : null}
        <h2 id="faq-heading">{faq.title}</h2>
        {faq.lead.trim() ? <p className="geo-faq-lead">{faq.lead}</p> : null}
        <div className="geo-faq-list">
          {items.map((item) => (
            <details key={item.question} className="geo-faq-item">
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
        {faq.cta_label.trim() ? (
          <a href={ctaHref} className="geo-faq-cta">
            {faq.cta_label}
          </a>
        ) : null}
      </div>
    </section>
  );
}
