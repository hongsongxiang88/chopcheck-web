'use client';

import { useState, useEffect } from 'react';
import { initializePaddle, Paddle } from '@paddle/paddle-js';

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userId: string;
  companyId: string;
};

export default function UnlockModal({ open, onClose, onConfirm, userId, companyId }: Props) {
  const [paying, setPaying] = useState(false);
  const [paddle, setPaddle] = useState<Paddle | null>(null);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN) return;

    initializePaddle({
      token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
      eventCallback: (event) => {
        if (event.name === 'checkout.completed') {
          setPaying(false);
          try {
            const bc = new BroadcastChannel('paddle_checkout');
            bc.postMessage({ type: 'PAYMENT_SUCCESS', companyId });
            bc.close();
          } catch (e) {
            console.error('BroadcastChannel error:', e);
          }
          onConfirm(); // 支付成功，通知父组件
        } else if (event.name === 'checkout.closed') {
          setPaying(false);
          onClose(); // 🔥 核心修复：如果是用户手动关闭/取消，明确调用取消逻辑
        }
      },
    }).then((p) => {
      if (p) setPaddle(p);
    });
  }, [onConfirm, onClose, companyId]);

  if (!open) return null;

  const handlePay = () => {
    if (!paddle) {
      alert('Payment component loading, please wait...');
      return;
    }

    setPaying(true);

    try {
      paddle.Checkout.open({
        items: [{ priceId: 'pri_01m5mc78d9m2pmnkm442988eta', quantity: 1 }], 
        customData: { userId, companyId },
        settings: {
          displayMode: 'overlay',
          variant: 'one-page',
        },
      });
    } catch (error) {
      console.error('Paddle Checkout Error:', error);
      setPaying(false);
      alert('Failed to open payment page, please try again.');
    }
  };

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
            onClick={onClose} // 点击取消按钮，触发父级的 handlePaymentCancel
            disabled={paying}
            className="flex-1 border border-line py-3 text-sm font-semibold text-muted transition-colors hover:text-foreground disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handlePay}
            disabled={paying || !paddle}
            className="flex-1 bg-chop py-3 text-sm font-semibold text-paper transition-colors hover:bg-[#D1442E] disabled:opacity-60"
          >
            {paying ? 'Processing…' : 'Pay $9.9'}
          </button>
        </div>
      </div>
    </div>
  );
}