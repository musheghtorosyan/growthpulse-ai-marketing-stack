import type { ReactNode } from "react";

export default function MarketingShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(80%_60%_at_20%_0%,rgba(0,0,0,0.06),transparent_60%),radial-gradient(70%_40%_at_100%_30%,rgba(0,0,0,0.04),transparent_55%)] text-zinc-950">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-black/[.06] bg-white/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-black/[.10] bg-white">
              <span className="text-sm font-semibold tracking-tight">GP</span>
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold">GrowthPulse AI</div>
              <div className="text-xs text-zinc-600">Marketing stack diagnosis</div>
            </div>
          </div>

          <nav className="hidden items-center gap-6 md:flex">
            <a className="text-sm text-zinc-700 hover:text-zinc-950" href="#features">
              Features
            </a>
            <a className="text-sm text-zinc-700 hover:text-zinc-950" href="#pricing">
              Pricing
            </a>
            <a className="text-sm text-zinc-700 hover:text-zinc-950" href="#contact">
              Get the report
            </a>
          </nav>

          <div className="hidden md:block">
            <a
              href="#contact"
              className="inline-flex h-10 items-center justify-center rounded-full bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              Get diagnosed
            </a>
          </div>
        </div>
      </header>

      {children}

      <footer className="border-t border-black/[.06] bg-white/70">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-zinc-600">
            Built for the Azarian Growth Agency assessment. Fictional customers, real intent.
          </p>
          <p className="text-sm text-zinc-600">
            {new Date().getFullYear()} GrowthPulse AI
          </p>
        </div>
      </footer>
    </div>
  );
}

