"use client";

export type TrackEventParams = {
  eventName: string;
  properties?: Record<string, unknown>;
  utm?: {
    utm_source?: string | null;
    utm_medium?: string | null;
    utm_campaign?: string | null;
    utm_content?: string | null;
    utm_term?: string | null;
  };
  sessionId: string;
  abVariant: string;
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export async function trackCustomEvent(params: TrackEventParams) {
  const payload = {
    event_name: params.eventName,
    event_props: params.properties ?? {},
    utm: params.utm ?? {},
    session_id: params.sessionId,
    ab_variant: params.abVariant,
  };

  // 1) Always send to our own backend so events are persisted.
  try {
    await fetch("/api/events", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // Intentionally ignore: analytics should never block UX.
  }

  // 2) Optional forward to GA4 if the page has loaded gtag.
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    const props: Record<string, unknown> = {
      ...payload.event_props,
      session_id: payload.session_id,
      ab_variant: payload.ab_variant,
    };
    window.gtag("event", payload.event_name, props);
  }
}

