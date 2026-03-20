import { NextRequest, NextResponse } from "next/server";

/**
 * Sets up A/B test + a lightweight session identifier.
 * - `gp_ab_variant` decides which hero headline/CTA copy is shown.
 * - `gp_sid` lets us correlate events to a single visitor session.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname !== "/" && pathname !== "/thank-you") return NextResponse.next();

  const abCookie = req.cookies.get("gp_ab_variant")?.value;
  const sidCookie = req.cookies.get("gp_sid")?.value;

  if (abCookie && sidCookie) return NextResponse.next();

  const res = NextResponse.next();

  if (!sidCookie) {
    res.cookies.set("gp_sid", crypto.randomUUID(), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }

  if (!abCookie) {
    const variant = Math.random() < 0.5 ? "A" : "B";
    res.cookies.set("gp_ab_variant", variant, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }

  return res;
}

