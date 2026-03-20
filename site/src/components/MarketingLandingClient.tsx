"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FEATURES, BRAND, SOCIAL_PROOF, PRICING_TIERS } from "@/lib/growthpulseContent";
import type { UTMValues } from "@/lib/utm";
import { trackCustomEvent } from "@/lib/clientTracking";
import LeadForm from "@/components/LeadForm";

function FauxLogo({ short, name }: { short: string; name: string }) {
  return (
    <div
      className="flex h-12 w-32 items-center justify-center rounded-xl border border-black/[.08] bg-white/70 px-3 text-center"
      aria-label={name}
      role="img"
    >
      <div className="text-sm font-semibold tracking-tight text-zinc-900">{short}</div>
    </div>
  );
}

function ScrollDepthTracker({
  sessionId,
  abVariant,
  utm,
}: {
  sessionId: string;
  abVariant: string;
  utm: UTMValues;
}) {
  const sentRef = useRef<Record<string, boolean>>({});

  useEffect(() => {
    const thresholds = [25, 50, 75];

    const onScroll = () => {
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop;
      const height = doc.scrollHeight - doc.clientHeight;
      if (height <= 0) return;
      const pct = Math.round((scrollTop / height) * 100);

      for (const t of thresholds) {
        if (pct >= t && !sentRef.current[t]) {
          sentRef.current[t] = true;
          trackCustomEvent({
            eventName: "scroll_depth",
            properties: { percent: t },
            utm,
            sessionId,
            abVariant,
          });
        }
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // catch early states
    return () => window.removeEventListener("scroll", onScroll);
  }, [utm, sessionId, abVariant]);

  return null;
}

export default function MarketingLandingClient({
  utm,
  sessionId,
  abVariant,
}: {
  utm: UTMValues;
  sessionId: string;
  abVariant: string;
}) {
  const fallbackDimensions = useMemo(
    () => [
      { slug: "acquisition", name: "Acquisition" },
      { slug: "activation", name: "Activation" },
      { slug: "retention", name: "Retention" },
      { slug: "revenue", name: "Revenue" },
      { slug: "referral", name: "Referral" },
      { slug: "seo_health", name: "SEO health" },
      { slug: "paid_efficiency", name: "Paid efficiency" },
    ],
    []
  );

  const [dimensions, setDimensions] = useState<typeof fallbackDimensions>(fallbackDimensions);

  useEffect(() => {
    // Attempt to load dimension metadata from the seeded DB.
    fetch("/api/dimensions")
      .then((r) => r.json())
      .then((json: unknown) => {
        const j = json as {
          ok?: unknown;
          dimensions?: Array<{ slug?: unknown; name?: unknown }>;
        };

        if (j.ok === true && Array.isArray(j.dimensions) && j.dimensions.length) {
          const mapped = j.dimensions
            .filter(
              (d): d is { slug: string; name: string } =>
                typeof d.slug === "string" && typeof d.name === "string"
            )
            .map((d) => ({ slug: d.slug, name: d.name }));

          if (mapped.length) setDimensions(mapped);
        }
      })
      .catch(() => null);
  }, [fallbackDimensions]);

  const heroCopy = useMemo(() => {
    if (abVariant === "B") {
      return {
        headline: "Stop guessing. Diagnose your marketing in minutes.",
        subhead:
          "GrowthPulse AI connects your tools, scores 7 growth dimensions, and turns the gap into a 90-day plan your team can actually execute.",
        cta: BRAND.primaryCTA,
      };
    }
    return {
      headline: BRAND.tagline,
      subhead:
        "Connect your stack, uncover the ROI leaks, and get a prioritized 90-day roadmap across 7 growth dimensions—without another agency call.",
      cta: "See my Growth Score",
    };
  }, [abVariant]);

  useEffect(() => {
    // Record assignment once per session.
    fetch("/api/ab-assignment", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ session_id: sessionId, ab_variant: abVariant }),
    }).catch(() => null);

    // Track exposure so the A/B test is measurable.
    trackCustomEvent({
      eventName: "ab_variant_exposed",
      properties: { variant: abVariant },
      utm,
      sessionId,
      abVariant,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function scrollToContact() {
    const el = document.getElementById("contact");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function onPrimaryCTA() {
    await trackCustomEvent({
      eventName: "cta_click",
      properties: { location: "hero", variant: abVariant },
      utm,
      sessionId,
      abVariant,
    });
    scrollToContact();
  }

  async function onFinalCTA() {
    await trackCustomEvent({
      eventName: "cta_click",
      properties: { location: "footer_cta", variant: abVariant },
      utm,
      sessionId,
      abVariant,
    });
    scrollToContact();
  }

  return (
    <>
      <ScrollDepthTracker sessionId={sessionId} abVariant={abVariant} utm={utm} />

      <main id="main" className="flex-1">
        {/* Hero */}
        <section className="mx-auto w-full max-w-6xl px-4 pb-10 pt-14 sm:pt-20">
          <div className="grid items-start gap-10 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-black/[.08] bg-white/70 px-3 py-1 text-sm text-zinc-700">
                <span className="font-semibold text-zinc-950">Real diagnostics</span>
                <span aria-hidden="true">•</span>
                <span>Board-ready outputs</span>
              </div>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
                {heroCopy.headline}
              </h1>
              <p className="mt-4 max-w-xl text-lg leading-8 text-zinc-600">{heroCopy.subhead}</p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={onPrimaryCTA}
                  className="inline-flex h-12 items-center justify-center rounded-full bg-zinc-950 px-5 text-sm font-semibold text-white transition hover:bg-zinc-800"
                >
                  {heroCopy.cta}
                </button>
                <button
                  type="button"
                  onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                  className="inline-flex h-12 items-center justify-center rounded-full border border-black/[.10] bg-white/60 px-5 text-sm font-semibold text-zinc-950 transition hover:bg-white"
                >
                  See pricing
                </button>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-black/[.08] bg-white/70 p-4">
                  <div className="text-sm font-semibold">Integration</div>
                  <div className="mt-1 text-sm text-zinc-600">Under 5 minutes</div>
                </div>
                <div className="rounded-2xl border border-black/[.08] bg-white/70 p-4">
                  <div className="text-sm font-semibold">Scoring</div>
                  <div className="mt-1 text-sm text-zinc-600">7 growth dimensions</div>
                </div>
                <div className="rounded-2xl border border-black/[.08] bg-white/70 p-4">
                  <div className="text-sm font-semibold">Roadmap</div>
                  <div className="mt-1 text-sm text-zinc-600">90-day priorities</div>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative">
              <div className="absolute -inset-4 rounded-[2rem] bg-[radial-gradient(40%_40%_at_50%_30%,rgba(0,0,0,0.10),transparent_60%)]" />
              <div className="relative rounded-[2rem] border border-black/[.10] bg-white/70 p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold">GrowthPulse Snapshot</div>
                    <div className="mt-1 text-xs text-zinc-600">Fictional live preview</div>
                  </div>
                  <div className="rounded-full bg-zinc-950 px-3 py-1 text-xs font-semibold text-white">
                    Updated now
                  </div>
                </div>

                <div className="mt-5 grid gap-3">
                  {dimensions.map((d) => {
                    const sampleA: Record<string, number> = {
                      acquisition: 58,
                      activation: 44,
                      retention: 63,
                      revenue: 52,
                      referral: 41,
                      seo_health: 57,
                      paid_efficiency: 46,
                    };
                    const sampleB: Record<string, number> = {
                      acquisition: 61,
                      activation: 49,
                      retention: 56,
                      revenue: 45,
                      referral: 37,
                      seo_health: 62,
                      paid_efficiency: 40,
                    };

                    const val = abVariant === "B" ? sampleB[d.slug] : sampleA[d.slug];

                    return (
                      <div key={d.name}>
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-sm font-medium text-zinc-900">{d.name}</div>
                          <div className="text-sm font-semibold text-zinc-950">{val}</div>
                        </div>
                        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-zinc-100">
                          <div
                            className="h-full rounded-full bg-zinc-950"
                            style={{ width: `${val}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-5 rounded-2xl bg-zinc-50 p-4">
                  <div className="text-sm font-semibold text-zinc-950">AI Action Plan</div>
                  <ul className="mt-2 space-y-2 text-sm text-zinc-700">
                    <li>1) Fix onboarding drop-off (highest leverage)</li>
                    <li>2) Rebuild paid efficiency reporting</li>
                    <li>3) Strengthen SEO coverage for bottom-funnel pages</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mx-auto w-full max-w-6xl px-4 pb-12">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-zinc-950">What GrowthPulse does</h2>
              <p className="mt-2 max-w-2xl text-zinc-600">
                The honest friend who reads your dashboards: integrations, scoring, and a roadmap you can ship.
              </p>
            </div>
            <div className="mt-2 text-sm text-zinc-600">
              Designed for teams who execute, not guess.
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-3xl border border-black/[.08] bg-white/70 p-5 shadow-sm"
              >
                <div className="text-base font-semibold text-zinc-950">{f.title}</div>
                <p className="mt-2 text-sm leading-6 text-zinc-600">{f.blurb}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {f.highlights.map((h) => (
                    <span
                      key={h}
                      className="rounded-full border border-black/[.10] bg-white px-2.5 py-1 text-xs font-semibold text-zinc-800"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Social proof */}
        <section className="mx-auto w-full max-w-6xl px-4 pb-12">
          <div className="rounded-[2rem] border border-black/[.08] bg-white/70 p-6 shadow-sm sm:p-10">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <h2 className="text-3xl font-semibold tracking-tight text-zinc-950">Proof beats promises</h2>
                <p className="mt-3 text-zinc-600">{SOCIAL_PROOF.testimonial}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  {SOCIAL_PROOF.stats.map((s) => (
                    <div
                      key={s}
                      className="rounded-full bg-zinc-950 px-4 py-2 text-sm font-semibold text-white"
                    >
                      {s}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {SOCIAL_PROOF.logos.map((l) => (
                  <FauxLogo key={l.name} name={l.name} short={l.short} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="mx-auto w-full max-w-6xl px-4 pb-12">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-zinc-950">Pricing that scales with accountability</h2>
              <p className="mt-2 text-zinc-600">Pick your integration depth and diagnostic frequency.</p>
            </div>
            <div className="text-sm text-zinc-600">No fluff. Just measurable progress.</div>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {PRICING_TIERS.map((tier, idx) => {
              const emphasized = idx === 1; // middle tier stands out
              return (
                <div
                  key={tier.name}
                  className={[
                    "rounded-[2rem] border bg-white/70 p-6 shadow-sm",
                    emphasized ? "border-zinc-950" : "border-black/[.08]",
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-base font-semibold text-zinc-950">{tier.name}</div>
                      <div className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">
                        {tier.price}
                      </div>
                      <div className="mt-1 text-sm text-zinc-600">Billed monthly</div>
                    </div>
                    {emphasized ? (
                      <div className="rounded-full bg-zinc-950 px-3 py-1 text-xs font-semibold text-white">
                        Most chosen
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-5 space-y-3 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-zinc-600">Integrations</span>
                      <span className="font-semibold text-zinc-950">{tier.integrations}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-zinc-600">Reports</span>
                      <span className="font-semibold text-zinc-950">{tier.reports}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-zinc-600">Action plans</span>
                      <span className="font-semibold text-zinc-950">{tier.actionPlans}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-zinc-600">Users</span>
                      <span className="font-semibold text-zinc-950">{tier.users}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-zinc-600">Support</span>
                      <span className="font-semibold text-zinc-950">{tier.support}</span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={onFinalCTA}
                      className={[
                        "flex h-12 w-full items-center justify-center rounded-full text-sm font-semibold transition",
                        emphasized ? "bg-zinc-950 text-white hover:bg-zinc-800" : "bg-white text-zinc-950 border border-black/[.10] hover:bg-zinc-50",
                      ].join(" ")}
                    >
                      {tier.cta}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Final CTA + Lead capture */}
        <section id="contact" className="mx-auto w-full max-w-6xl px-4 pb-20">
          <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
            <div className="rounded-[2rem] border border-black/[.08] bg-white/70 p-7 shadow-sm">
              <h2 className="text-3xl font-semibold tracking-tight text-zinc-950">Get your GrowthPulse report</h2>
              <p className="mt-3 text-zinc-600">
                Fill this out and we’ll generate your diagnostic inputs. We’ll also track your UTM source so we can
                tell which channels actually work.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-zinc-50 p-4">
                  <div className="text-sm font-semibold text-zinc-950">What you get</div>
                  <div className="mt-1 text-sm text-zinc-600">7-dimension score snapshot + 90-day plan preview</div>
                </div>
                <div className="rounded-2xl bg-zinc-50 p-4">
                  <div className="text-sm font-semibold text-zinc-950">How fast</div>
                  <div className="mt-1 text-sm text-zinc-600">Under 5 minutes for integration (demo)</div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={onFinalCTA}
                  className="inline-flex h-12 items-center justify-center rounded-full bg-zinc-950 px-5 text-sm font-semibold text-white transition hover:bg-zinc-800"
                >
                  {BRAND.primaryCTA}
                </button>
              </div>
            </div>

            <div className="rounded-[2rem] border border-black/[.08] bg-white/70 p-7 shadow-sm">
              <LeadForm
                utm={utm}
                sessionId={sessionId}
                abVariant={abVariant}
                onSuccess={() => {
                  window.location.href = "/thank-you";
                }}
              />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

