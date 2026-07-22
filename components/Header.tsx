"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { navLinks } from "@/data/home";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
      <div className="header-inner">
        <Link href="/" className="logo-link" onClick={() => setOpen(false)}>
          <Image
            src="/images/logo.png"
            alt="WinDoor Quote"
            width={174}
            height={44}
            priority
          />
        </Link>

        <button
          type="button"
          className={`mobile-toggle${open ? " is-open" : ""}`}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>

        <div
          className={`nav-backdrop${open ? " is-open" : ""}`}
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />

        <nav className={`main-nav${open ? " is-open" : ""}`}>
          <ul>
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={() => setOpen(false)}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="/#contactus"
            className="header-cta"
            onClick={() => setOpen(false)}
          >
            Contact us
          </a>
        </nav>
      </div>
    </header>
  );
}
