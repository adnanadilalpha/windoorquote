"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

function scrollToHash(hash: string) {
  const id = decodeURIComponent(hash.replace(/^#/, ""));
  if (!id) return false;
  const el = document.getElementById(id);
  if (!el) return false;
  el.scrollIntoView({ block: "start" });
  return true;
}

function scheduleHashScroll(hash: string) {
  if (scrollToHash(hash)) return () => {};

  const timers = [0, 50, 150, 300, 600, 1000].map((ms) =>
    window.setTimeout(() => scrollToHash(hash), ms),
  );

  return () => timers.forEach(clearTimeout);
}

export default function HashScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    return scheduleHashScroll(hash);
  }, [pathname]);

  useEffect(() => {
    const onHashChange = () => {
      if (window.location.hash) scheduleHashScroll(window.location.hash);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return null;
}
