'use client';

import { useState } from 'react';
import { unlockReport } from '@/lib/api';

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userId: string;
  companyId: string;
};

export default function UnlockModal({ open, onClose, onConfirm, userId, companyId }: Props) {
  const [paying, setPaying] = useState(false);

  if (!open) return null;

  async function handlePay() {
    setPaying(true);
    try {
      // 1. TODO: 这里接你的真实支付网关（Stripe / 支付宝 / 微信）
      // const payRes = await fetch('/api/create-payment', { ... });
      // if (!payRes.ok) throw new Error('Payment failed');

      // 2. 支付成功后，调用后端写入 Redis 解锁标记
      await unlockReport(userId, companyId);
      
      // 3. 通知父组件刷新
      onConfirm();
    } catch (error) {
      console.error(error);
      alert('付款解锁失败，请重试');
    } finally {
      setPaying(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-5">
      <div className="w-full max-w-sm border border-line bg-panel p-8">
        <h4 className="font-serif text-lg font-medium text-paper">Unlock full report</h4>
        <p className="mt-3 text-[13px] leading-relaxed text-muted">
          Pay <strong className="text-foreground">$9.9</strong> to reveal shareholders,
          enforcement records, address classification and the bilingual AI risk narrative for
          this company. One-time charge, no account required.
        </p>

        <div className="mt-5 flex items-baseline gap-2 border-y border-line py-4">
          <span className="font-mono text-[28px] text-paper">$9.9</span>
          <span className="text-xs text-muted">one-time</span>
        </div>

        <div className="mt-5 flex gap-2.5">
          <button
            onClick={onClose}
            disabled={paying}
            className="flex-1 border border-line py-3 text-sm font-semibold text-muted transition-colors hover:text-foreground disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handlePay}
            disabled={paying}
            className="flex-1 bg-chop py-3 text-sm font-semibold text-paper transition-colors hover:bg-[#D1442E] disabled:opacity-60"
          >
            {paying ? 'Processing…' : 'Pay $9.9'}
          </button>
        </div>
      </div>
    </div>
  );
}