import MarketingLandingClient from "@/components/MarketingLandingClient";
import MarketingShell from "@/components/MarketingShell";
import { readUTMFromSearchParams } from "@/lib/utm";
import { cookies } from "next/headers";

export default async function Home({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const cookieStore = await cookies();
  const abVariant = cookieStore.get("gp_ab_variant")?.value ?? "A";
  const sessionId = cookieStore.get("gp_sid")?.value ?? "unknown";

  const utm = readUTMFromSearchParams(searchParams);

  return (
    <MarketingShell>
      <MarketingLandingClient utm={utm} sessionId={sessionId} abVariant={abVariant} />
    </MarketingShell>
  );
}

