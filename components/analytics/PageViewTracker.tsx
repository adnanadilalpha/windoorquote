"use client";

import { ENGAGED_SESSION_SECONDS } from "@/lib/analytics/bot";
import {
  getOrRefreshSession,
  touchSession,
} from "@/lib/analytics/client-session";
import { canTrackAnalytics } from "@/lib/analytics/track-client";
import { normalizeAnalyticsPath } from "@/lib/analytics/normalize-path";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const VIEW_KEY = "windoor.analytics.view";
const SESSION_VIEWS_KEY = "windoor.analytics.session-views";
const HEARTBEAT_MS = 10_000;

type SessionViewMap = Record<string, Record<string, string>>;

function readSessionViewMap(): SessionViewMap {
  try {
    const raw = sessionStorage.getItem(SESSION_VIEWS_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as SessionViewMap;
  } catch {
    return {};
  }
}

function getSessionViewId(sessionId: string, path: string): string | null {
  return readSessionViewMap()[sessionId]?.[path] ?? null;
}

function setSessionViewId(sessionId: string, path: string, viewId: string) {
  const map = readSessionViewMap();
  map[sessionId] = { ...(map[sessionId] ?? {}), [path]: viewId };
  sessionStorage.setItem(SESSION_VIEWS_KEY, JSON.stringify(map));
}

function countSessionPages(sessionId: string): number {
  return Object.keys(readSessionViewMap()[sessionId] ?? {}).length;
}

async function patchPageView(
  viewId: string,
  sessionId: string,
  options: { durationSeconds?: number; isBounce?: boolean } = {},
) {
  await fetch("/api/analytics/page-view", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      viewId,
      sessionId,
      durationSeconds: options.durationSeconds,
      isBounce: options.isBounce,
    }),
    keepalive: true,
  });

  touchSession();
}

async function trackPageView(path: string, sessionId: string) {
  if (!canTrackAnalytics()) return null;

  const response = await fetch("/api/analytics/page-view", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId,
      visitorId: getOrRefreshSession().visitorId || null,
      path,
      pageTitle: document.title,
      referrer: document.referrer || null,
    }),
    keepalive: true,
  });

  if (!response.ok) return null;

  const payload = (await response.json()) as {
    id?: string;
    skipped?: boolean;
    deduped?: boolean;
  };

  if (payload.skipped || !payload.id) return null;

  sessionStorage.setItem(VIEW_KEY, payload.id);
  setSessionViewId(sessionId, path, payload.id);
  touchSession();
  return payload.id;
}

export function PageViewTracker() {
  const pathname = usePathname();
  const startedAtRef = useRef(Date.now());
  const engagedRef = useRef(false);
  const viewIdRef = useRef<string | null>(null);
  const activePathRef = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin") || !canTrackAnalytics()) {
      return;
    }

    const path = normalizeAnalyticsPath(pathname);
    const session = getOrRefreshSession();
    const now = Date.now();
    let cancelled = false;

    const previousPath = activePathRef.current;
    const previousViewId = viewIdRef.current ?? sessionStorage.getItem(VIEW_KEY);
    const previousStartedAt = startedAtRef.current;

    if (previousViewId && previousPath && previousPath !== path) {
      const previousDuration = Math.max(
        1,
        Math.round((now - previousStartedAt) / 1000),
      );
      void patchPageView(previousViewId, session.id, {
        durationSeconds: previousDuration,
        isBounce: false,
      });
      engagedRef.current = true;
    }

    activePathRef.current = path;
    startedAtRef.current = now;
    engagedRef.current = false;
    viewIdRef.current = null;

    const existingViewId = getSessionViewId(session.id, path);

    const bindView = (viewId: string | null) => {
      if (cancelled || activePathRef.current !== path) return;
      viewIdRef.current = viewId;
      if (viewId) sessionStorage.setItem(VIEW_KEY, viewId);
    };

    if (existingViewId) {
      bindView(existingViewId);
      void patchPageView(existingViewId, session.id, { isBounce: false });
      engagedRef.current = true;
    } else {
      void trackPageView(path, session.id).then((id) => {
        bindView(id);
      });
    }

    const markEngaged = () => {
      engagedRef.current = true;
    };

    const currentDuration = () =>
      Math.max(1, Math.round((Date.now() - startedAtRef.current) / 1000));

    const persist = (isExit: boolean) => {
      if (cancelled) return;
      const viewId = viewIdRef.current ?? sessionStorage.getItem(VIEW_KEY);
      if (!viewId) return;

      const durationSeconds = currentDuration();
      const multiPage = countSessionPages(session.id) > 1;
      const engaged =
        engagedRef.current ||
        multiPage ||
        durationSeconds >= ENGAGED_SESSION_SECONDS;

      void patchPageView(viewId, session.id, {
        durationSeconds,
        isBounce: isExit ? !engaged : false,
      });
    };

    const engagementTimer = window.setTimeout(
      markEngaged,
      ENGAGED_SESSION_SECONDS * 1000,
    );
    const heartbeat = window.setInterval(() => {
      if (currentDuration() >= ENGAGED_SESSION_SECONDS) markEngaged();
      persist(false);
    }, HEARTBEAT_MS);

    window.addEventListener("scroll", markEngaged, { once: true, passive: true });
    window.addEventListener("pointerdown", markEngaged, { once: true });
    window.addEventListener("keydown", markEngaged, { once: true });

    const handlePageHide = () => persist(true);
    const handleVisibility = () => {
      if (document.visibilityState === "hidden") persist(true);
    };

    window.addEventListener("pagehide", handlePageHide);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      cancelled = true;
      window.clearTimeout(engagementTimer);
      window.clearInterval(heartbeat);
      window.removeEventListener("scroll", markEngaged);
      window.removeEventListener("pointerdown", markEngaged);
      window.removeEventListener("keydown", markEngaged);
      window.removeEventListener("pagehide", handlePageHide);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [pathname]);

  return null;
}
