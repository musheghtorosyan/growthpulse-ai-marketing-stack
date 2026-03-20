import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

const EventSchema = z.object({
  event_name: z.string().min(1),
  event_props: z.record(z.string(), z.unknown()).optional().default({}),
  utm: z
    .object({
      utm_source: z.string().nullable().optional(),
      utm_medium: z.string().nullable().optional(),
      utm_campaign: z.string().nullable().optional(),
      utm_content: z.string().nullable().optional(),
      utm_term: z.string().nullable().optional(),
    })
    .optional(),
  session_id: z.string().min(1),
  ab_variant: z.string().min(1),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = EventSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
  }

  let supabase;
  try {
    supabase = getSupabaseAdmin();
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Supabase not configured" },
      { status: 500 }
    );
  }

  const { error } = await supabase
    .from("analytics_events")
    .insert({
      event_name: parsed.data.event_name,
      event_props: parsed.data.event_props,
      utm: parsed.data.utm ?? {},
      session_id: parsed.data.session_id,
      ab_variant: parsed.data.ab_variant,
    });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

