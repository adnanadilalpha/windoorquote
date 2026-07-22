"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { HomeSectionLabels, Video } from "@/lib/content/types";
import { mediaUrl } from "@/lib/content/media";

function youtubeId(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.replace("/", "") || null;
    }
    const fromQuery = parsed.searchParams.get("v");
    if (fromQuery) return fromQuery;
    const embed = parsed.pathname.match(/\/embed\/([^/]+)/);
    return embed?.[1] ?? null;
  } catch {
    return null;
  }
}

function embedSrc(id: string, origin: string) {
  const params = new URLSearchParams({
    autoplay: "1",
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
  });
  if (origin) params.set("origin", origin);
  return `https://www.youtube.com/embed/${id}?${params.toString()}`;
}

type Props = {
  videos: Video[];
  labels: Pick<HomeSectionLabels, "videos_title">;
};

export default function Videos({ videos, labels }: Props) {
  const [open, setOpen] = useState<number | null>(null);
  const [origin, setOrigin] = useState("");
  const current = open !== null ? videos[open] : null;
  const id = current ? youtubeId(current.youtube_url) : null;

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const close = useCallback(() => setOpen(null), []);

  const step = useCallback(
    (dir: 1 | -1) => {
      setOpen((i) => {
        if (i === null) return i;
        return (i + dir + videos.length) % videos.length;
      });
    },
    [videos.length],
  );

  useEffect(() => {
    if (open === null) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    }

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close, step]);

  const src = useMemo(
    () => (id ? embedSrc(id, origin) : null),
    [id, origin],
  );

  return (
    <section id="demos" className="flow-section videos-lane">
      <div className="videos-lane-inner">
        <header className="flow-section-head">
          <h2>{labels.videos_title}</h2>
        </header>

        <ul className="videos-lane-grid">
          {videos.map((video, index) => (
            <li
              key={video.id}
              className={`videos-lane-cell${index >= 3 ? " is-shift" : ""}`}
            >
              <button
                type="button"
                className="videos-lane-card"
                onClick={() => setOpen(index)}
                aria-label={`Play ${video.title} demo`}
              >
                <span className="videos-lane-shell">
                  <span className="videos-lane-spine" aria-hidden="true">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                  </span>

                  <span className="videos-lane-stage">
                    <span className="videos-lane-thumb media-fill">
                      <Image
                        src={mediaUrl(video.thumb_path)}
                        alt=""
                        fill
                        sizes="(max-width: 700px) 100vw, (max-width: 980px) 50vw, 33vw"
                        unoptimized={video.thumb_path.endsWith(".gif")}
                        className="videos-lane-img"
                        priority={index < 3}
                      />
                    </span>
                    <span className="videos-lane-shine" aria-hidden="true" />
                    <span className="videos-lane-play" aria-hidden="true">
                      <span />
                    </span>
                    <span className="videos-lane-corners" aria-hidden="true" />
                  </span>

                  <span className="videos-lane-sill">
                    <strong>{video.title}</strong>
                    <span className="videos-lane-arrow" aria-hidden="true">
                      ▶
                    </span>
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {current && src && (
        <div
          className="videos-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${current.title} demo`}
          onClick={close}
        >
          <div
            className="videos-lightbox-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="videos-lightbox-bar">
              <h3>{current.title}</h3>
              <button
                type="button"
                className="videos-lightbox-close"
                onClick={close}
                aria-label="Close demo"
              >
                Close
              </button>
            </div>
            <div className="videos-lightbox-stage">
              <iframe
                key={src}
                className="videos-lightbox-frame"
                src={src}
                title={current.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
