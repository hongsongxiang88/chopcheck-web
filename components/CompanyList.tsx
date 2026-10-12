'use client';

import type { Company } from '@/lib/types';
import ReportPanel from './ReportPanel';

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
  onUnlock: (index: number) => void;
};

export default function CompanyList({
  companies,
  translatedKeyword,
  originalKeyword,
  selectedIndex,
  onSelect,
  unlockedIndex,
  onUnlock,
}: Props) {
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
        <span>{companies.length} companies matched</span>
        <span className="normal-case text-muted">
          &quot;{originalKeyword}&quot; → <span className="text-foreground">{translatedKeyword}</span>
        </span>
      </div>

      <div role="list">
        {companies.map((company, i) => {
          const selected = selectedIndex === i;
          return (
            <div
              id={`company-row-${i}`}
              key={`${company.credit_code}-${i}`}
              role="listitem"
              className="scroll-mt-6"
            >
              {/* 记录行（点击展开/收起） */}
              <div
                onClick={() => onSelect(i)}
                aria-expanded={selected}
                className={`flex cursor-pointer flex-col gap-2 border-b border-line px-1 py-4 text-left transition-colors hover:bg-white/[0.03] ${
                  selected ? 'bg-chop/[0.08]' : ''
                }`}
              >
                {/* 1. 英文公司名 */}
                <div className="text-[15px] font-medium leading-snug text-foreground">
                  {company.name_en || '-'}
                </div>

                {/* 英文法人名 / 状态 / 创建日 / credit_code */}
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

                {/* 中文公司名 / 中文法人名 */}
                <div className="flex flex-wrap items-center gap-x-4 text-xs text-muted/80">
                  <span>中文名称: {company.name || '-'}</span>
                  <span>法人: {company.legal_person || '-'}</span>
                </div>
              </div>

              {/* 选中时，在该记录下方内联展开报告 */}
              {selected && (
                <div className="border-b border-line bg-ink/40 px-4 pb-8 pt-2">
                  <ReportPanel
                    company={company}
                    unlocked={unlockedIndex === i}
                    onUnlock={() => onUnlock(i)}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}