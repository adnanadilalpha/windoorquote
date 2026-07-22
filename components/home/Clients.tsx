"use client";

import Image from "next/image";
import { useCallback, useState, type MouseEvent } from "react";
import { clients } from "@/data/home";

type Client = (typeof clients)[number];

type Active = {
  key: string;
  client: Client;
  top: number;
  left: number;
};

export default function Clients() {
  const [active, setActive] = useState<Active | null>(null);
  const row = [...clients, ...clients];

  const clear = useCallback(() => setActive(null), []);

  const show = useCallback(
    (key: string, client: Client, e: MouseEvent<HTMLAnchorElement>) => {
      if (!window.matchMedia("(hover: hover)").matches) return;
      const section = e.currentTarget.closest("section");
      if (!(section instanceof HTMLElement)) return;

      const chip = e.currentTarget.getBoundingClientRect();
      const box = section.getBoundingClientRect();
      const stageW = Math.min(420, box.width - 32);
      const centerX = chip.left + chip.width / 2 - box.left;
      const left = Math.min(
        Math.max(centerX, stageW / 2 + 16),
        box.width - stageW / 2 - 16,
      );

      setActive({
        key,
        client,
        top: chip.bottom - box.top + 14,
        left,
      });
    },
    [],
  );

  return (
    <section
      id="clients"
      className={`flow-section clients-flow${active ? " is-scoped" : ""}`}
    >
      <div className="flow-section-head">
        <p className="flow-kicker">Partners</p>
        <h2>OUR CLIENTS</h2>
      </div>

      <div className="clients-marquee" aria-label="Client logos">
        <div className="clients-track">
          {row.map((client, i) => {
            const key = `${client.name}-${i}`;
            const inert = i >= clients.length;
            const isActive = active?.key === key;

            return (
              <a
                key={key}
                href={client.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`clients-chip${isActive ? " is-peeking" : ""}`}
                title={client.name}
                tabIndex={inert ? -1 : undefined}
                aria-hidden={inert ? true : undefined}
                onMouseEnter={(e) => show(key, client, e)}
                onMouseLeave={clear}
              >
                <Image
                  src={client.src}
                  alt={inert ? "" : client.name}
                  width={160}
                  height={70}
                  className="clients-chip-img"
                />
              </a>
            );
          })}
        </div>
      </div>

      {active && (
        <div
          className="clients-stage"
          aria-hidden="true"
          style={{ top: active.top, left: active.left }}
        >
          <Image
            src={active.client.src}
            alt=""
            width={400}
            height={180}
            className="clients-stage-img"
          />
        </div>
      )}
    </section>
  );
}
