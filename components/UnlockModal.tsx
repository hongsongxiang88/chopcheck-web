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

  // 1. 初始化 Paddle 前端 SDK
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN) return;

    initializePaddle({
      token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
      // 如果你要在沙盒测试，可以取消下面这行的注释，并确保 token 是沙盒的
      // environment: 'sandbox', 
      eventCallback: (event) => {
        // 监听 Paddle 的事件，处理 UI 状态
        if (event.name === 'checkout.completed') {
          // 支付流程完成（此时后端 Webhook 可能还没处理完，所以前端只是提示）
          setPaying(false);
          onConfirm();
        } else if (event.name === 'checkout.closed') {
          // 用户主动关闭了支付弹窗，取消 Loading 状态
          setPaying(false);
        }
      },
    }).then((p) => {
      if (p) setPaddle(p);
    });
  }, [onConfirm]);

  if (!open) return null;

  const handlePay = () => {
    if (!paddle) {
      alert('支付组件加载中，请稍后再试');
      return;
    }

    setPaying(true);

    try {
      paddle.Checkout.open({
        // 🔥 替换成你在 Paddle 后台创建的价格 ID（以 pri_ 开头）
        items: [{ priceId: 'pri_01m5mc78d9m2pmnkm442988eta', quantity: 1 }], 
        customData: {
          // 关键：这些数据会传到你的后端 Webhook，用于核销订单和解锁(userid当前浏览器用户companyid公司信用代码)
          userId: userId,
          companyId: companyId,
        },
        settings: {
          displayMode: 'overlay',
          variant: 'one-page',
          // 支付成功后，Paddle 会重定向回这个页面
          // successUrl: window.location.href, 
        },
      });
    } catch (error) {
      console.error('Paddle Checkout Error:', error);
      setPaying(false);
      alert('无法打开支付页面，请重试');
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
            onClick={onClose}
            disabled={paying}
            className="flex-1 border border-line py-3 text-sm font-semibold text-muted transition-colors hover:text-foreground disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handlePay}
            disabled={paying || !paddle} // 在 paddle 未加载完或支付中禁用按钮
            className="flex-1 bg-chop py-3 text-sm font-semibold text-paper transition-colors hover:bg-[#D1442E] disabled:opacity-60"
          >
            {paying ? 'Processing…' : 'Pay $9.9'}
          </button>
        </div>
      </div>
    </div>
  );
}