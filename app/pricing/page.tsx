'use client';

import Link from 'next/link';
import PricingSection from '@/components/PricingSection';

export default function PricingPage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* 头部导航 */}
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-3xl items-baseline justify-between px-6 py-5 sm:px-7">
          <Link href="/" className="group flex flex-col">
            <div className="font-serif text-xl font-semibold sm:text-[22px] group-hover:opacity-80 transition-opacity">
              Chop<span className="text-chop">Check</span>
            </div>
            <div className="mt-0.5 text-xs text-muted sm:text-[13px]">
              Verify the company before you wire the deposit.
            </div>
          </Link>
          <div className="flex items-center gap-5 text-sm text-muted">
            <Link href="/" className="hover:text-foreground">
              ← Back to Search
            </Link>
          </div>
        </div>
      </header>

      {/* 主体内容：直接显示价格卡片 */}
      <div className="mx-auto w-full max-w-3xl flex-1 px-6 sm:px-7 pt-16 pb-20 flex flex-col items-center">
        
        {/* 直接渲染价格卡片 */}
        <div className="w-full max-w-md">
          <PricingSection 
            onBuySingle={() => {
              // 因为在这个页面没有选中具体的公司，所以点击购买直接跳回主页让用户去搜索
              window.location.href = '/';
            }}
          />
        </div>
        
        {/* 底部的辅助链接 */}
        <div className="mt-12 text-center text-sm text-muted">
          <p>Have questions about our reports? <Link href="/contact" className="text-chop hover:underline">Contact us</Link>.</p>
        </div>
      </div>

      {/* 底部 Footer */}
      <footer className="border-t border-line bg-ink py-8 text-xs text-muted text-center">
        <p>© {new Date().getFullYear()} ChopCheck. All rights reserved.</p>
      </footer>
    </main>
  );
}