export const ANALYTICS_EVENTS = {
  CTA_CLICK: "cta_click",
  NAV_CLICK: "nav_click",
  CONTACT_SUBMIT: "contact_submit",
  VIDEO_PLAY: "video_play",
} as const;

export type AnalyticsEventName =
  (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

export const ANALYTICS_EVENT_LABELS: Record<AnalyticsEventName, string> = {
  cta_click: "CTA click",
  nav_click: "Navigation click",
  contact_submit: "Contact form submitted",
  video_play: "Video played",
};
