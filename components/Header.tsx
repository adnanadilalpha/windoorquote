"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { HeaderSettings, NavLink } from "@/lib/content/types";
import { mediaUrl } from "@/lib/content/media";
import { ANALYTICS_EVENTS } from "@/lib/analytics/event-types";
import { trackAnalyticsEvent } from "@/lib/analytics/track-client";
import { safeHref } from "@/lib/security/safe-url";

type Props = {
  navLinks: NavLink[];
  header: HeaderSettings;
};

export default function Header({ navLinks, header }: Props) {
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

  function trackNav(label: string, href: string) {
    void trackAnalyticsEvent(ANALYTICS_EVENTS.NAV_CLICK, {
      label,
      metadata: { href },
    });
  }

  function trackCta(label: string, href: string) {
    void trackAnalyticsEvent(ANALYTICS_EVENTS.CTA_CLICK, {
      label,
      metadata: { href, placement: "header" },
    });
  }

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
      <div className="header-inner">
        <Link
          href="/"
          className="logo-link"
          onClick={() => {
            setOpen(false);
            trackNav("Logo", "/");
          }}
        >
          <Image
            src={mediaUrl(header.logo_path) || "/images/logo.png"}
            alt={header.logo_alt || "WinDoor Quote"}
            width={174}
            height={44}
            priority
            style={{ width: "auto", height: "auto" }}
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
            {navLinks.map((link) => {
              const href = safeHref(link.href);
              return (
                <li key={link.id}>
                  <a
                    href={href}
                    onClick={() => {
                      setOpen(false);
                      trackNav(link.label, href);
                    }}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
          <a
            href={safeHref(header.cta_href)}
            className="header-cta"
            onClick={() => {
              setOpen(false);
              trackCta(header.cta_label, safeHref(header.cta_href));
            }}
          >
            {header.cta_label}
          </a>
        </nav>
      </div>
    </header>
  );
}
