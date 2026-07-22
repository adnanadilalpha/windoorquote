"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";
import { features } from "@/data/home";

export default function Features() {
  const riverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = riverRef.current;
    if (!root) return;

    const nodes = root.querySelectorAll<HTMLElement>("[data-flow-node]");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      nodes.forEach((n) => n.classList.add("is-in"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -10% 0px" },
    );

    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" className="features-river">
      <div className="features-river-wash" aria-hidden="true">
        <span className="features-river-blob features-river-blob--a" />
        <span className="features-river-blob features-river-blob--b" />
        <span className="features-river-blob features-river-blob--c" />
      </div>

      <header className="features-river-head">
        <p className="flow-kicker">Capabilities</p>
        <h2>FEATURES</h2>
      </header>

      <div className="features-river-body" ref={riverRef}>
        <svg
          className="features-river-stream"
          viewBox="0 0 100 1200"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            className="features-river-stream-core"
            d="M50 0 C 78 80, 22 160, 50 240 C 78 320, 22 400, 50 480 C 78 560, 22 640, 50 720 C 78 800, 22 880, 50 960 C 78 1040, 22 1120, 50 1200"
          />
        </svg>

        <ol className="features-river-list">
          {features.map((feature, index) => {
            const side = index % 2 === 0 ? "left" : "right";
            return (
              <li
                key={feature.title}
                data-flow-node
                className={`features-river-node features-river-node--${side}`}
                style={{ "--i": index } as CSSProperties}
              >
                <div className="features-river-content">
                  <div className="features-river-icon">
                    <Image
                      src={feature.image}
                      alt=""
                      width={120}
                      height={120}
                      unoptimized
                    />
                  </div>
                  <div className="features-river-copy">
                    <span className="features-river-num" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
