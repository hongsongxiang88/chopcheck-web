'use client';

import { useRef, useState, useEffect } from 'react';
import SearchBar from '@/components/SearchBar';
import CompanyList from '@/components/CompanyList';
import UnlockModal from '@/components/UnlockModal';
import Toast from '@/components/Toast';
import PricingSection from '@/components/PricingSection'; // 👈 新增引入
import type { SearchResponse } from '@/lib/types';
import Link from 'next/link';

export default function Home() {
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SearchResponse | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  
  const [unlockedIndex, setUnlockedIndex] = useState<number | null>(null);
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);
  
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [userId, setUserId] = useState('');

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

  function selectCompany(index: number) {
    setSelectedIndex((prev) => (prev === index ? null : index));
    if (unlockedIndex !== index) {
      setUnlockedIndex(null);
    }
  }

  function requestUnlock(index: number) {
    if (unlockedIndex === index) {
      showToast('This report is already unlocked.');
      return;
    }
    setPendingIndex(index);
  }

  function confirmUnlock() {
    if (pendingIndex === null) return;
    setUnlockedIndex(pendingIndex);
    setPendingIndex(null);
    showToast('Charged $9.9 — report unlocked.');
  }

  const pendingCompanyId = pendingIndex !== null && result?.companies[pendingIndex] 
    ? result.companies[pendingIndex].credit_code 
    : '';

  return (
    <main className="flex min-h-screen flex-col">
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-3xl items-baseline justify-between px-6 py-5 sm:px-7">
          <div>
            <div className="font-serif text-xl font-semibold sm:text-[22px]">
              Chop<span className="text-chop">Check</span>
            </div>
            <div className="mt-0.5 text-xs text-muted sm:text-[13px]">
              Verify the company before you wire the deposit.
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted">
            <Link href="/blog" className="text-sm text-muted hover:text-foreground">
              Blog
            </Link>
            <a href="#" className="hover:text-foreground">
              Sign in
            </a>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-3xl flex-1 px-6 sm:px-7">
        <section className="pb-8 pt-12 sm:pt-16">
          <h1 className="max-w-lg font-serif text-[28px] font-medium leading-tight text-paper sm:text-4xl">
            Search a company name. See what&apos;s behind the chop.
          </h1>
          <p className="mt-3.5 max-w-md text-sm text-muted sm:text-[15px]">
            Enter a company&apos;s unified social credit code or a keyword. We check it against
            Chinese business registries and screen for red flags, so you know who you&apos;re
            dealing with before you commit to a supplier.
          </p>

          <div className="mt-8">
            <SearchBar value={keyword} onChange={setKeyword} onSubmit={runSearch} loading={loading} />
          </div>

          {error && (
            <p className="mt-3 border border-chop-dim bg-chop/[0.06] px-4 py-3 text-sm text-chop">
              {error}
            </p>
          )}
        </section>

        {result && (
          <CompanyList
            companies={result.companies}
            translatedKeyword={result.translated_keyword}
            originalKeyword={result.original_keyword}
            selectedIndex={selectedIndex}
            onSelect={selectCompany}
            unlockedIndex={unlockedIndex}
            onUnlock={requestUnlock}
            userId={userId}
          />
        )}

        {/* 👇 单一价格表模块 👇 */}
        <PricingSection 
          onBuySingle={() => {
            if (selectedIndex === null) {
              showToast('Please select a company first.');
              return;
            }
            requestUnlock(selectedIndex);
          }}
        />

      </div>

      <footer className="mt-20 border-t border-line bg-ink py-10 text-xs text-muted">
        <div className="mx-auto max-w-3xl px-6 sm:px-7">
          <div className="flex flex-col justify-between gap-8 sm:flex-row">
            <div>
              <div className="font-serif text-lg font-semibold text-paper">
                Chop<span className="text-chop">Check</span>
              </div>
              <p className="mt-2 max-w-xs leading-relaxed">
                Professional cross-border due diligence. Verify Chinese companies before you wire the deposit.
              </p>
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
                {/* 记得把这里的邮箱换成你真实的邮箱！ */}
                <a href="mailto:support@chopcheck.com" className="hover:text-foreground">Email Support</a>
              </div>
            </div>
          </div>
          
          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-line pt-6 text-[11px] sm:flex-row">
            <p>© {new Date().getFullYear()} ChopCheck. All rights reserved.</p>
            <p>
              Payments processed securely by <a href="https://paddle.com" target="_blank" rel="noreferrer" className="underline hover:text-foreground">Paddle.com</a>.
            </p>
          </div>
        </div>
      </footer>

      <UnlockModal
        open={pendingIndex !== null}
        onClose={() => setPendingIndex(null)}
        onConfirm={confirmUnlock}
        userId={userId}
        companyId={pendingCompanyId}
      />
      
      <Toast message={toast} />
    </main>
  );
}