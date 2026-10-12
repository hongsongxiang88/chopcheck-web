'use client';

type Props = {
  onBuySingle: () => void;
  onOpenBundle: () => void;
};

export default function PricingSection({ onBuySingle, onOpenBundle }: Props) {
  return (
    <section className="mt-20 pb-20">
      <h3 className="font-serif text-xl font-medium text-paper sm:text-[22px]">Pricing</h3>
      <p className="mt-1.5 text-sm text-muted">
        Search is always free — 3 lookups a day, no account. Pay only when you want the full
        report.
      </p>

      <div className="mt-7 grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2">
        <div className="flex flex-col bg-panel p-6 sm:p-7">
          <div className="text-xs uppercase tracking-wide text-muted">Single report</div>
          <div className="mt-2.5 font-mono text-[32px] text-paper">$19.9</div>
          <p className="mt-3 flex-1 text-[13px] leading-relaxed text-muted">
            Unlocks whichever company&apos;s report you currently have open. PDF export included.
            No account required.
          </p>
          <button
            onClick={onBuySingle}
            className="mt-5 border border-line py-3 text-sm font-semibold text-foreground transition-opacity hover:opacity-90"
          >
            Unlock this report
          </button>
        </div>

        <div className="flex flex-col bg-panel2 p-6 sm:p-7">
          <div className="text-xs uppercase tracking-wide text-muted">10-report bundle</div>
          <div className="mt-2.5 font-mono text-[32px] text-paper">
            $99<span className="text-sm text-muted"> · $9.9 ea</span>
          </div>
          <p className="mt-3 flex-1 text-[13px] leading-relaxed text-muted">
            Prepay once, spend the credits whenever — on this company or the next nine you check.
            Credits don&apos;t expire.
          </p>
          <button
            onClick={onOpenBundle}
            className="mt-5 border border-chop bg-chop py-3 text-sm font-semibold text-paper transition-colors hover:bg-[#D1442E]"
          >
            Buy 10 credits
          </button>
        </div>
      </div>
    </section>
  );
}
