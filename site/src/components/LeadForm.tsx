"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { trackCustomEvent } from "@/lib/clientTracking";
import type { UTMValues } from "@/lib/utm";

const LeadFormSchema = z.object({
  name: z.string().min(2, "Please enter your name.").max(120),
  email: z.string().email("Please enter a valid email.").max(254),
  marketing_team_size: z.string().min(1, "Select an option."),
});

type LeadFormValues = z.infer<typeof LeadFormSchema>;

export default function LeadForm({
  utm,
  sessionId,
  abVariant,
  onSuccess,
}: {
  utm: UTMValues;
  sessionId: string;
  abVariant: string;
  onSuccess: () => void;
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const didTrackStart = useRef(false);

  const form = useForm<LeadFormValues>({
    resolver: zodResolver(LeadFormSchema),
    defaultValues: {
      name: "",
      email: "",
      marketing_team_size: "",
    },
    mode: "onBlur",
  });

  function trackStartOnce() {
    if (didTrackStart.current) return;
    didTrackStart.current = true;
    trackCustomEvent({
      eventName: "form_start",
      properties: {},
      utm,
      sessionId,
      abVariant,
    });
  }

  async function onSubmit(values: LeadFormValues) {
    setServerError(null);
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          marketing_team_size: values.marketing_team_size,
          utm,
          session_id: sessionId,
          ab_variant: abVariant,
        }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Submission failed.");
      }

      await trackCustomEvent({
        eventName: "form_submit",
        properties: { marketing_team_size: values.marketing_team_size },
        utm,
        sessionId,
        abVariant,
      });

      onSuccess();
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "Submission failed.");
      setIsSubmitting(false);
      return;
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-5"
      noValidate
    >
      <div>
        <label className="text-sm font-semibold text-zinc-900">Name</label>
        <input
          type="text"
          className="mt-2 w-full rounded-xl border border-black/[.10] bg-white px-3 py-2 text-sm outline-none transition focus:border-zinc-950"
          placeholder="Alex Johnson"
          {...form.register("name")}
          onFocus={trackStartOnce}
        />
        {form.formState.errors.name ? (
          <p className="mt-2 text-sm text-red-600">{form.formState.errors.name.message}</p>
        ) : null}
      </div>

      <div>
        <label className="text-sm font-semibold text-zinc-900">Work email</label>
        <input
          type="email"
          className="mt-2 w-full rounded-xl border border-black/[.10] bg-white px-3 py-2 text-sm outline-none transition focus:border-zinc-950"
          placeholder="alex@company.com"
          {...form.register("email")}
          onFocus={trackStartOnce}
        />
        {form.formState.errors.email ? (
          <p className="mt-2 text-sm text-red-600">{form.formState.errors.email.message}</p>
        ) : null}
      </div>

      <div>
        <label className="text-sm font-semibold text-zinc-900">
          Marketing team size (qualifying field)
        </label>
        <select
          className="mt-2 w-full rounded-xl border border-black/[.10] bg-white px-3 py-2 text-sm outline-none transition focus:border-zinc-950"
          {...form.register("marketing_team_size")}
          onChange={trackStartOnce}
        >
          <option value="">Select…</option>
          <option value="2-4">2-4 people</option>
          <option value="5-8">5-8 people</option>
          <option value="9-20">9-20 people</option>
        </select>
        {form.formState.errors.marketing_team_size ? (
          <p className="mt-2 text-sm text-red-600">
            {form.formState.errors.marketing_team_size.message}
          </p>
        ) : null}
      </div>

      {serverError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {serverError}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex h-12 w-full items-center justify-center rounded-full bg-zinc-950 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-60"
      >
        {isSubmitting ? "Submitting..." : "Send my GrowthPulse report"}
      </button>

      <p className="text-xs text-zinc-600">
        By submitting, you agree to receive your diagnostic report. No spam. No sales theater.
      </p>
    </form>
  );
}

