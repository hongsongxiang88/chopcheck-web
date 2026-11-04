'use client';

import type { Company } from '@/lib/types';
import ReportPanel from './ReportPanel';
import { useState, useEffect } from 'react';

function statusStyle(status: string) {
  const s = status.toLowerCase();
  if (status.includes('存续') || status.includes('在业') || s.includes('active') || s.includes('operational')) {
    return 'border-jade-dim text-jade';
  }
  if (status.includes('异常') || status.includes('警示') || s.includes('warning') || s.includes('abnormal')) {
    return 'border-amber text-amber';
  }
  if (status.includes('吊销') || status.includes('注销') || s.includes('revoked') || s.includes('deregistered') || s.includes('dissolved')) {
    return 'border-chop-dim text-chop';
  }
  return 'border-line text-muted';
}

type Props = {
  companies: Company[];
  translatedKeyword: string;
  originalKeyword: string;
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  unlockedIndex: number | null;
  verifyingIndex: number | null; // 新增
  onUnlock: (index: number) => void;
  onVerifiedSuccess: (index: number) => void; // 新增
  userId: string;
};

export default function CompanyList({
  companies,
  translatedKeyword,
  originalKeyword,
  selectedIndex,
  onSelect,
  unlockedIndex,
  verifyingIndex,
  onUnlock,
  onVerifiedSuccess,
  userId,
}: Props) {
  const [loadingReportIndex, setLoadingReportIndex] = useState<number | null>(null);

  useEffect(() => {
    if (selectedIndex !== null) {
      setLoadingReportIndex(selectedIndex);
      const timer = setTimeout(() => {
        setLoadingReportIndex(null);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setLoadingReportIndex(null);
    }
  }, [selectedIndex]);

  if (companies.length === 0) {
    return (
      <section className="mt-9 border-t border-line pt-6 text-sm text-muted">
        No matching companies found for &quot;{originalKeyword}&quot;. Try a broader keyword —
        e.g. a brand name instead of a full company name.
      </section>
    );
  }

  return (
    <section className="mt-9">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-line pb-2.5 text-[11px] uppercase tracking-wide text-muted">
        <span className="flex items-center gap-2">
          {companies.length} companies matched
          <span className="hidden sm:inline-block h-3 w-3 animate-spin rounded-full border border-line border-t-chop"></span>
        </span>
        <span className="normal-case text-muted">
          &quot;{originalKeyword}&quot; → <span className="text-foreground">{translatedKeyword}</span>
        </span>
      </div>

      <div role="list">
        {companies.map((company, i) => {
          const selected = selectedIndex === i;
          const rowId = `company-row-${company.credit_code || i}`;
          
          return (
            <div
              id={rowId}
              key={`${company.credit_code}-${i}`}
              role="listitem"
              className="scroll-mt-10"
            >
              <div
                onClick={() => onSelect(i)}
                aria-expanded={selected}
                className={`flex cursor-pointer flex-col gap-2 border-b border-line px-1 py-4 text-left transition-colors hover:bg-white/[0.03] ${
                  selected ? 'bg-chop/[0.08]' : ''
                }`}
              >
                {/* 🔥 英文大字，中文小字 */}
                <div className="text-[15px] font-medium leading-snug text-foreground">
                  {company.name_en || '-'}
                </div>
                <div className="text-[13px] text-muted mt-0.5">
                  {company.name || '-'}
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                  <span className="text-muted">
                    Legal Person (EN):{' '}
                    <span className="text-foreground">{company.legal_person_en || '-'}</span>
                  </span>

                  <span
                    className={`w-fit whitespace-nowrap border px-2 py-0.5 text-[11px] ${statusStyle(company.status)}`}
                  >
                    {company.status}
                  </span>

                  <span className="font-mono text-muted">
                    Established: {company.establish_date || '-'}
                  </span>

                  <span className="font-mono text-muted">
                    Code: {company.credit_code || '-'}
                  </span>
                </div>

                {/* 🔥 移除了重复的中文名称，只保留法人 */}
                <div className="flex flex-wrap items-center gap-x-4 text-xs text-muted/80">
                  <span>法人: {company.legal_person || '-'}</span>
                </div>
              </div>

              {selected && (
                <div className="border-b border-line bg-ink/40 px-4 pb-8 pt-2 relative min-h-[120px]">
                  {loadingReportIndex === i ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-line border-t-chop"></div>
                      <p className="mt-4 text-xs text-muted animate-pulse">
                        Analyzing company data & generating report...
                      </p>
                    </div>
                  ) : (
                    <ReportPanel
                      company={company}
                      userId={userId}
                      unlocked={unlockedIndex === i}
                      verifying={verifyingIndex === i} // 传递验证状态
                      onUnlock={() => onUnlock(i)}
                      onVerifiedSuccess={() => onVerifiedSuccess(i)} // 传递成功回调
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}