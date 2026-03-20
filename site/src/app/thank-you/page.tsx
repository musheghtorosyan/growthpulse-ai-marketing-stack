import MarketingShell from "@/components/MarketingShell";

export default function ThankYouPage() {
  return (
    <MarketingShell>
      <main className="flex-1">
        <section className="mx-auto w-full max-w-3xl px-4 py-16">
          <div className="rounded-2xl border border-black/[.08] bg-white p-8 shadow-sm">
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
              You’re in. We’ll send your GrowthPulse diagnostic.
            </h1>
            <p className="mt-3 text-zinc-600">
              Thanks for submitting. If you don’t see our email within a few minutes, check spam.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-zinc-50 p-4">
                <p className="text-sm text-zinc-600">What happens next</p>
                <p className="mt-1 font-medium">Integration checklist + 90-day plan preview</p>
              </div>
              <div className="rounded-xl bg-zinc-50 p-4">
                <p className="text-sm text-zinc-600">Why it matters</p>
                <p className="mt-1 font-medium">Stop guessing where ROI leaks</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </MarketingShell>
  );
}

