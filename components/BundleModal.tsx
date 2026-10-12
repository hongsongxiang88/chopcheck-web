'use client';

import { useState } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function BundleModal({ open, onClose, onConfirm }: Props) {
  const [email, setEmail] = useState('');

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-5">
      <div className="w-full max-w-sm border border-line bg-panel p-8">
        <h4 className="font-serif text-lg font-medium text-paper">Buy 10 report credits</h4>
        <p className="mt-3 text-[13px] leading-relaxed text-muted">
          $99 total, $9.9 per report. After checkout we&apos;ll email a license key — paste it
          here on any future visit and your credits carry over, no password needed.
        </p>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className="mt-5 w-full border border-line bg-ink px-3.5 py-3 text-sm text-foreground outline-none placeholder:text-muted focus:border-chop-dim"
        />
        <div className="mt-4 flex gap-2.5">
          <button
            onClick={onClose}
            className="flex-1 border border-line py-3 text-sm font-semibold text-muted transition-colors hover:text-foreground"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-chop py-3 text-sm font-semibold text-paper transition-colors hover:bg-[#D1442E]"
          >
            Pay $99
          </button>
        </div>
      </div>
    </div>
  );
}
