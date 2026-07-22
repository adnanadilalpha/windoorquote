"use client";

import Image from "next/image";
import { useCallback, useState, type MouseEvent } from "react";
import type { Client, HomeSectionLabels } from "@/lib/content/types";
import { mediaUrl } from "@/lib/content/media";

type Active = {
  key: string;
  client: Client;
  top: number;
  left: number;
};

type Props = {
  clients: Client[];
  labels: Pick<HomeSectionLabels, "clients_title">;
};

export default function Clients({ clients, labels }: Props) {
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

  if (!clients.length) return null;

  return (
    <section
      id="clients"
      className={`flow-section clients-flow${active ? " is-scoped" : ""}`}
    >
      <div className="flow-section-head">
        <h2>{labels.clients_title}</h2>
      </div>

      <div className="clients-marquee" aria-label="Client logos">
        <div className="clients-track">
          {row.map((client, i) => {
            const key = `${client.id}-${i}`;
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
                  src={mediaUrl(client.logo_path)}
                  alt={inert ? "" : client.name}
                  width={160}
                  height={70}
                  className="clients-chip-img"
                  style={{ width: "auto", height: "auto" }}
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
            src={mediaUrl(active.client.logo_path)}
            alt=""
            width={400}
            height={180}
            className="clients-stage-img"
            style={{ width: "auto", height: "auto" }}
          />
        </div>
      )}
    </section>
  );
}
