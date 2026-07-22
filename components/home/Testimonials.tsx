import Image from "next/image";
import type { HomeSectionLabels, Testimonial } from "@/lib/content/types";
import { mediaUrl } from "@/lib/content/media";

type Props = {
  testimonials: Testimonial[];
  labels: Pick<HomeSectionLabels, "testimonials_title">;
};

export default function Testimonials({ testimonials, labels }: Props) {
  if (!testimonials.length) return null;

  return (
    <section id="testimonials" className="testimonials-stagger">
      <header className="testimonials-stagger-head">
        <h2>{labels.testimonials_title}</h2>
      </header>

      <div className="testimonials-stagger-stage">
        {testimonials.map((item, index) => (
          <blockquote
            key={item.id}
            className={`testimonials-stagger-card testimonials-stagger-card--${index + 1}`}
          >
            <div className="testimonials-stagger-person">
              <div className="testimonials-stagger-who">
                <strong>{item.author}</strong>
                <span>{item.role}</span>
              </div>
              {item.logo_path ? (
                <span className="testimonials-stagger-logo">
                  <Image
                    src={mediaUrl(item.logo_path)}
                    alt=""
                    fill
                    sizes="120px"
                  />
                </span>
              ) : null}
            </div>
            <p>“{item.quote}”</p>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
