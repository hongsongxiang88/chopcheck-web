'use client';

type Props = {
  onBuySingle: () => void;
};

export default function PricingSection({ onBuySingle }: Props) {
  return (
    <section className="mt-20 border-t border-line pt-10 pb-10">
      <div className="text-center">
        <h3 className="font-serif text-xl font-medium text-paper sm:text-[22px]">Pricing</h3>
        <p className="mt-1.5 text-sm text-muted mx-auto max-w-md">
          Search is always free — 3 lookups a week, no account required. Pay only when you want the full report.
        </p>
      </div>

      <div className="mx-auto mt-8 max-w-sm border border-line bg-panel p-6 sm:p-7">
        <div className="text-xs uppercase tracking-wide text-muted text-center">Single Deep Report</div>
        <div className="mt-3 font-mono text-[36px] text-paper text-center">$9.9</div>
        <p className="mt-4 text-center text-[13px] leading-relaxed text-muted">
          Unlocks the full detailed report for the company you currently have open. 
          Includes bilingual AI risk narrative, shareholder details, and PDF export.
        </p>
        <button
          onClick={onBuySingle}
          className="mt-6 w-full bg-chop py-3.5 text-sm font-semibold text-paper transition-colors hover:bg-[#D1442E]"
        >
          Unlock this report — $9.9
        </button>
      </div>
    </section>
  );
}