'use client';

import { useRef, useState, useEffect } from 'react';
import SearchBar from '@/components/SearchBar';
import CompanyList from '@/components/CompanyList';
import UnlockModal from '@/components/UnlockModal';
import Toast from '@/components/Toast';
import type { SearchResponse } from '@/lib/types';
import Link from 'next/link';

export default function Home() {
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SearchResponse | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  
  const [unlockedIndex, setUnlockedIndex] = useState<number | null>(null);
  const [verifyingIndex, setVerifyingIndex] = useState<number | null>(null);
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);
  
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [userId, setUserId] = useState('');

  // 🔥 新增：用于获取结果列表区域的 DOM 引用，方便自动滚动
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let uid = localStorage.getItem('chopcheck_uid');
    if (!uid) {
      uid = typeof crypto !== 'undefined' && crypto.randomUUID 
        ? crypto.randomUUID() 
        : Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem('chopcheck_uid', uid);
    }
    setUserId(uid);
  }, []);

  // 🔥 新增：当搜索结果出现时，自动平滑滚动到结果区域
  useEffect(() => {
    if (result && resultsRef.current) {
      // 延迟 100ms 确保 DOM 已经渲染完毕
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [result]);

  // ... 中间关于支付和搜索的逻辑保持不变 ...
  useEffect(() => {
    if (pendingIndex === null && verifyingIndex === null) return;
    if (!userId) return;

    const targetCompanyId = pendingIndex !== null && result?.companies[pendingIndex]
      ? result.companies[pendingIndex].credit_code
      : (verifyingIndex !== null && result?.companies[verifyingIndex] ? result.companies[verifyingIndex].credit_code : null);

    if (!targetCompanyId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/check-limit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, companyId: targetCompanyId }),
        });
        const data = await res.json();
        
        if (data.isPaidView === true) {
          clearInterval(interval);
          if (pendingIndex !== null) setPendingIndex(null);
          const targetIndex = pendingIndex !== null ? pendingIndex : verifyingIndex;
          if (targetIndex !== null) handleVerifiedSuccess(targetIndex);
        }
      } catch (err) {
        console.error('Polling error', err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [pendingIndex, verifyingIndex, userId, result]);

  function showToast(message: string) {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2400);
  }

  async function runSearch() {
    const q = keyword.trim();
    if (!q || loading) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setSelectedIndex(null);
    setUnlockedIndex(null);
    setVerifyingIndex(null);
    setPendingIndex(null);

    // 🔥 新增：开始搜索时，自动滚动到结果加载区域，让用户看到下面的 Loading 动画
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    try {
      const res = await fetch('/api/search-company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company_keyword: q }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || '查询失败,请稍后重试');
        return;
      }

      setResult(data as SearchResponse);
    } catch {
      setError('网络请求失败,请检查连接后重试');
    } finally {
      setLoading(false);
    }
  }

  // ... selectCompany, requestUnlock 等逻辑保持不变 ...
  function selectCompany(index: number) {
    setSelectedIndex((prev) => (prev === index ? null : index));
    if (unlockedIndex !== index) setUnlockedIndex(null);
  }

  function requestUnlock(index: number) {
    if (unlockedIndex === index || verifyingIndex === index) {
      showToast('This report is already unlocked or being verified.');
      return;
    }
    setPendingIndex(index);
  }

  function handlePaymentSuccess() {
    if (pendingIndex === null) return;
    const unlockedCompany = result?.companies[pendingIndex];
    setVerifyingIndex(pendingIndex);
    setPendingIndex(null); 
    showToast('Payment successful! Verifying...');
    setTimeout(() => {
      if (unlockedCompany) {
        const el = document.getElementById(`company-row-${unlockedCompany.credit_code}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  }

  function handleVerifiedSuccess(index: number) {
    setUnlockedIndex(index);
    setVerifyingIndex(null);
    showToast('Report unlocked successfully!');
  }

  function handlePaymentCancel() {
    setPendingIndex(null);
    setVerifyingIndex(null); 
  }

  const pendingCompanyId = pendingIndex !== null && result?.companies[pendingIndex] 
    ? result.companies[pendingIndex].credit_code 
    : '';

  return (
    <main className="flex min-h-screen flex-col">
      {/* header 保持不变 */}
      <header className="border-b border-line print:hidden">
        <div className="mx-auto flex max-w-3xl items-baseline justify-between px-6 py-5 sm:px-7">
          <div>
            <div className="font-serif text-xl font-semibold sm:text-[22px]">
              Chop<span className="text-chop">Check</span>
            </div>
            <div className="mt-0.5 text-xs text-muted sm:text-[13px]">
              Verify the company before you wire the deposit.
            </div>
          </div>
          <div className="flex items-center gap-5 text-sm text-muted">
            <Link href="/pricing" className="hover:text-foreground">Pricing</Link>
            <Link href="/blog" className="hover:text-foreground">Blog</Link>
            <a href="#" className="hover:text-foreground">Sign in</a>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-3xl flex-1 px-6 sm:px-7">
        {/* 搜索区保持不变 */}
        <section className="pb-8 pt-12 sm:pt-16 print:hidden">
          <h1 className="max-w-lg font-serif text-[28px] font-medium leading-tight text-paper sm:text-4xl">
            Search a company name. See what&apos;s behind the chop.
          </h1>
          
          <div className="mt-4 max-w-xl text-sm text-muted sm:text-[15px] leading-relaxed">
            <p className="mb-3">
              Verify Chinese suppliers before you wire the deposit. We cross-check publicly available Chinese business registry data to confirm:
            </p>
            <ul className="space-y-1.5 ml-1">
              <li>🏢 <strong className="text-paper font-semibold">Company Identity</strong> — Check legal status, registration details, and ownership.</li>
              <li>⚠️ <strong className="text-paper font-semibold">Risk Indicators</strong> — Screen for publicly reported legal disputes, operational abnormalities, and regulatory notices.</li>
              <li>📊 <strong className="text-paper font-semibold">Basic Business Information</strong> — Review publicly available registration and credit information.</li>
            </ul>
          </div>

          <div className="mt-8">
            <SearchBar value={keyword} onChange={setKeyword} onSubmit={runSearch} loading={loading} />
          </div>

          <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm text-muted sm:text-[13px]">
            <div>
              <p className="mb-1">Search by English keyword, Chinese keyword, or Unified Social Credit Code.</p>
              <p>Try a sample search like <span className="text-paper">"zijing"</span> and get <strong className="text-paper font-semibold">3 free lookups a week</strong>. No account needed.</p>
            </div>
            <Link href="/pricing" className="text-chop hover:underline whitespace-nowrap mt-2 sm:mt-0">View pricing →</Link>
          </div>

          {error && (
            <p className="mt-3 border border-chop-dim bg-chop/[0.06] px-4 py-3 text-sm text-chop">{error}</p>
          )}
        </section>

        {/* 🔥 修改点：给结果区域加上 ref，并重写 Loading 状态 */}
        <div ref={resultsRef}>
          {loading && (
            // 🔥 修改点：提供强烈的视觉反馈，告诉用户后台正在查数据
            <div className="mt-4 flex flex-col items-center justify-center border-t border-line pt-12 pb-16 print:hidden">
              <div className="relative flex h-16 w-16 items-center justify-center">
                <div className="absolute h-full w-full animate-ping rounded-full bg-chop/20"></div>
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-line border-t-chop"></div>
              </div>
              <h3 className="mt-6 text-lg font-medium text-paper">Searching Registry...</h3>
              <p className="mt-2 text-sm text-muted animate-pulse text-center max-w-sm">
                We are cross-checking public databases. This usually takes 30-60 seconds. Please do not close this page.
              </p>
            </div>
          )}

          {!loading && result && (
            <CompanyList
              companies={result.companies}
              translatedKeyword={result.translated_keyword}
              originalKeyword={result.original_keyword}
              selectedIndex={selectedIndex}
              onSelect={selectCompany}
              unlockedIndex={unlockedIndex}
              verifyingIndex={verifyingIndex}
              onUnlock={requestUnlock}
              onVerifiedSuccess={handleVerifiedSuccess}
              userId={userId}
            />
          )}
        </div>
      </div>

      {/* footer 和 弹窗保持不变 */}
      <footer className="mt-20 border-t border-line bg-ink py-10 text-xs text-muted print:hidden">
        <div className="mx-auto max-w-3xl px-6 sm:px-7">
          <div className="flex flex-col justify-between gap-8 sm:flex-row">
            <div>
              <div className="font-serif text-lg font-semibold text-paper">Chop<span className="text-chop">Check</span></div>
              <p className="mt-2 max-w-xs leading-relaxed">Professional cross-border due diligence. Verify Chinese companies before you wire the deposit.</p>
            </div>
            <div className="flex gap-12">
              <div className="flex flex-col gap-2.5">
                <span className="font-semibold text-paper">Legal</span>
                <Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link>
                <Link href="/terms" className="hover:text-foreground">Terms of Service</Link>
                <Link href="/refund" className="hover:text-foreground">Refund Policy</Link>
              </div>
              <div className="flex flex-col gap-2.5">
                <span className="font-semibold text-paper">Support</span>
                <Link href="/contact" className="hover:text-foreground">Contact Us</Link>
                <a href="mailto:support@chopcheck.com" className="hover:text-foreground">Email Support</a>
              </div>
            </div>
          </div>
          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-line pt-6 text-[11px] sm:flex-row">
            <p>© {new Date().getFullYear()} ChopCheck. All rights reserved.</p>
            <p>Payments processed securely by <a href="https://paddle.com" target="_blank" rel="noreferrer" className="underline hover:text-foreground">Paddle.com</a>.</p>
          </div>
        </div>
      </footer>

      <UnlockModal
        open={pendingIndex !== null}
        onClose={handlePaymentCancel}
        onConfirm={handlePaymentSuccess}
        userId={userId}
        companyId={pendingCompanyId}
      />
      
      <Toast message={toast} />
    </main>
  );
}