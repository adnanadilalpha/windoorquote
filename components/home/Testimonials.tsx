import Image from "next/image";
import { testimonials } from "@/data/home";

const logos: Record<string, string> = {
  "Scott Braun": "/images/clients/enerlux.png",
  "Jim Pesicka": "/images/clients/flexscreen.png",
};

export default function Testimonials() {
  return (
    <section id="testimonials" className="testimonials-stagger">
      <header className="testimonials-stagger-head">
        <p className="flow-kicker light">Voice</p>
        <h2>WHAT OUR CLIENTS SAY</h2>
      </header>

      <div className="testimonials-stagger-stage">
        {testimonials.map((item, index) => {
          const logo = logos[item.author];
          return (
            <blockquote
              key={item.author}
              className={`testimonials-stagger-card testimonials-stagger-card--${index + 1}`}
            >
              <div className="testimonials-stagger-person">
                {logo && (
                  <span className="testimonials-stagger-logo">
                    <Image src={logo} alt="" width={120} height={48} />
                  </span>
                )}
                <div className="testimonials-stagger-who">
                  <strong>{item.author}</strong>
                  <span>{item.role}</span>
                </div>
              </div>
              <p>“{item.quote}”</p>
            </blockquote>
          );
        })}
      </div>
    </section>
  );
}
