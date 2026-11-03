import { GEO_FAQS } from "@/lib/seo";

export default function GeoFaq() {
  return (
    <section id="faq" className="geo-faq" aria-labelledby="faq-heading">
      <div className="geo-faq-inner">
        <p className="geo-faq-kicker">Answers</p>
        <h2 id="faq-heading">Frequently asked questions</h2>
        <p className="geo-faq-lead">
          Clear answers for manufacturers evaluating window and door quoting
          software — and for search engines that need to understand WinDoor
          Quote.
        </p>
        <div className="geo-faq-list">
          {GEO_FAQS.map((item) => (
            <details key={item.question} className="geo-faq-item">
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
        <a href="#contactus" className="geo-faq-cta">
          Talk with the team
        </a>
      </div>
    </section>
  );
}
