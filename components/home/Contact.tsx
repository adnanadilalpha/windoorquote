"use client";

import ContactForm from "@/components/home/ContactForm";

export default function Contact() {
  return (
    <section id="contactus" className="contact-desk">
      <div className="contact-desk-inner">
        <div className="contact-desk-copy">
          <p className="flow-kicker light">Next step</p>
          <h2>CONTACT US</h2>
          <span className="contact-desk-spear" aria-hidden="true" />
          <p>
            If you manufacture fenestration products and are looking for an ERP
            and Quoting software to tie your entire business together under one
            software system, contact us to find out how we can help.
          </p>

          <ul className="contact-desk-points" aria-hidden="true">
            <li>
              <span />
              Cloud ERP & quoting
            </li>
            <li>
              <span />
              Built for manufacturers
            </li>
            <li>
              <span />
              Based in Omaha, NE
            </li>
          </ul>
        </div>

        <div>
          <div className="contact-desk-form-head">
            <p>Tell us about your shop</p>
          </div>
          <ContactForm submitLabel="Send message" showHint />
        </div>
      </div>
    </section>
  );
}
