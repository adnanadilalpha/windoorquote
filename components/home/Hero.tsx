"use client";

import Image from "next/image";

export default function Hero() {
  return (
    <section className="hero" aria-label="Introduction">
      <div className="hero-media media-fill" aria-hidden="true">
        <Image
          src="/images/hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="hero-image"
        />
      </div>
      <div className="hero-veil" aria-hidden="true" />

      <div className="hero-inner">
        <div className="hero-copy">
          <h1 className="hero-title">
            Taking the complex and making it simple.
          </h1>
          <p className="hero-lead">
            Cloud based ERP and quoting software for window, door, and screen
            manufacturers — fast, reliable, flexible, and intuitive.
          </p>
          <a href="/#contactus" className="hero-cta">
            Contact us
          </a>
        </div>
      </div>

      <a href="#features" className="hero-scroll" aria-label="Continue to features">
        <span />
      </a>
    </section>
  );
}
