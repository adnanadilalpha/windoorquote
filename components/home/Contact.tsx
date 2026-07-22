"use client";

import ContactForm from "@/components/home/ContactForm";
import type { HomeContact } from "@/lib/content/types";

export default function Contact({ contact }: { contact: HomeContact }) {
  return (
    <section id="contactus" className="contact-desk">
      <div className="contact-desk-inner">
        <div className="contact-desk-copy">
          <h2>{contact.title}</h2>
          <span className="contact-desk-spear" aria-hidden="true" />
          <p>{contact.body}</p>

          <ul className="contact-desk-points" aria-hidden="true">
            {contact.points.map((point) => (
              <li key={point}>
                <span />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="contact-desk-form-head">
            <p>{contact.form_heading}</p>
          </div>
          <ContactForm
            submitLabel={contact.submit_label}
            hint={contact.hint}
            successMessage={contact.success_message}
            showHint
          />
        </div>
      </div>
    </section>
  );
}
