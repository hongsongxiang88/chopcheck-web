'use client';

import { initializePaddle, Paddle } from '@paddle/paddle-js';
import { useEffect, useState } from 'react';

type Props = {
  onBuySingle?: () => void;
  userId?: string;
  companyId?: string;
  priceId?: string; // Paddle 后台的产品价格 ID，以 pri_ 开头
};

export default function PricingSection({ onBuySingle, userId = '', companyId = '', priceId = 'pri_你的价格ID' }: Props) {
  const [paddle, setPaddle] = useState<Paddle | null>(null);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN) return;

    // 直接使用环境变量初始化，去掉环境判断，默认走生产环境
    initializePaddle({
      token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
    }).then((p) => {
      if (p) setPaddle(p);
    });
  }, []);

  function handleBuy() {
    // 如果有传自定义回调，优先走回调（方便父组件拦截）
    if (onBuySingle) {
      onBuySingle();
      return;
    }

    // 否则直接调起 Paddle 弹窗
    if (paddle) {
      paddle.Checkout.open({
        items: [{ priceId, quantity: 1 }],
        customData: { userId, companyId }, // 关键：传给 Webhook 用于业务解扣
      });
    }
  }

  return (
    <section className="mt-0 pb-10">
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
          onClick={handleBuy}
          className="mt-6 w-full bg-chop py-3.5 text-sm font-semibold text-paper transition-colors hover:bg-[#D1442E]"
        >
          Unlock this report — $9.9
        </button>
      </div>
    </section>
  );
}