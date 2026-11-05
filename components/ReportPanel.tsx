'use client';

import { useEffect, useState } from 'react';
import type { Company } from '@/lib/types';
import { fetchDueDiligenceReport, checkViewLimit } from '@/lib/api';

function statusStyle(status: string) {
  if (status.includes('存续') || status.includes('在业')) return 'text-jade';
  if (status.includes('异常') || status.includes('警示')) return 'text-amber';
  if (status.includes('吊销') || status.includes('注销')) return 'text-chop';
  return 'text-muted';
}

export type DueDiligenceReport = {
  company_name_en: string;
  legal_person_en: string;
  operating_status_en: string;
  reg_address_en: string;
  address_type_en: string;
  website_age_en: string;
  reg_capital_en: string;
  paid_in_capital_en: string;
  social_security_count_en: string;
  top3_shareholders_desc_en: string;
  dishonest_records_desc_en: string;
  execution_records_desc_en: string;
  taxpayerno_level_en: string;
  changes_desc_en: string;
  exceptions_desc_en: string;
  penalties_desc_en: string;
  pledges_desc_en: string;
  risk_level_en: string;
  risk_level_cn: string;
  highlights_en: string[];
  highlights_cn: string[];
  risk_points_en: string[];
  risk_points_cn: string[];
  evaluation_en: string;
  evaluation_cn: string;
};

type FieldDef = {
  key: keyof DueDiligenceReport;
  label: string;
  sensitive?: boolean;
};

const BASIC_FIELDS: FieldDef[] = [
  { key: 'company_name_en', label: 'Company name (EN)' },
  { key: 'legal_person_en', label: 'Legal representative (EN)' },
  { key: 'operating_status_en', label: 'Operating status' },
  { key: 'reg_address_en', label: 'Registered address (EN)' },
  { key: 'address_type_en', label: 'Address type', sensitive: true },
];

const CAPITAL_FIELDS: FieldDef[] = [
  { key: 'reg_capital_en', label: 'Registered capital' },
  { key: 'paid_in_capital_en', label: 'Paid-in capital', sensitive: true },
  { key: 'social_security_count_en', label: 'Social security contributions', sensitive: true },
  { key: 'taxpayerno_level_en', label: 'Tax rating level', sensitive: true },
  { key: 'website_age_en', label: 'Website age' },
];

const COMPLIANCE_FIELDS: FieldDef[] = [
  { key: 'top3_shareholders_desc_en', label: 'Top 3 shareholders', sensitive: true },
  { key: 'changes_desc_en', label: 'Corporate history changes', sensitive: true },
  { key: 'exceptions_desc_en', label: 'Operational abnormalities', sensitive: true },
  { key: 'penalties_desc_en', label: 'Administrative penalties', sensitive: true },
  { key: 'pledges_desc_en', label: 'Equity / asset pledges', sensitive: true },
  { key: 'dishonest_records_desc_en', label: 'Dishonest / blacklisted records', sensitive: true },
  { key: 'execution_records_desc_en', label: 'Court enforcement records', sensitive: true },
];

type Props = {
  company: Company;
  userId: string;
  unlocked: boolean;
  verifying: boolean;
  onUnlock: () => void;
  onVerifiedSuccess: () => void;
};

export default function ReportPanel({ company, userId, unlocked, verifying, onUnlock, onVerifiedSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [report, setReport] = useState<DueDiligenceReport | null>(null);
  const [needPay, setNeedPay] = useState(false);
  const [remainingFree, setRemainingFree] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setErrorMsg(null);
      
      if (unlocked) {
        setNeedPay(false);
      }

      try {
        if (!unlocked) {
          const limit = await checkViewLimit(userId, company.credit_code);
          if (!cancelled) {
            if (!limit.canView) {
              setNeedPay(true);
              setLoading(false);
              return;
            }
            setRemainingFree(limit.remainingFree);
          }
        }

        const data = await fetchDueDiligenceReport(company.credit_code);
        if (!cancelled) {
          setReport(data as DueDiligenceReport);
        }
      } catch (err: any) {
        if (!cancelled) {
          console.error('Fetch error:', err);
          setErrorMsg(err?.message || 'Failed to fetch report. Please try again.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (!verifying) {
      load();
    }
    
    return () => {
      cancelled = true;
    };
  }, [company.credit_code, userId, unlocked, verifying]);

  useEffect(() => {
    if (!verifying) return;

    const interval = setInterval(async () => {
      try {
        const limit = await checkViewLimit(userId, company.credit_code);
        if (limit.isPaidView) {
          clearInterval(interval);
          onVerifiedSuccess();
        }
      } catch (err) {
        console.error("Verification poll error:", err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [verifying, userId, company.credit_code, onVerifiedSuccess]);

  // 🔥 核心修复：直接用 DOM 操作，只截取包含 id 的这一块
  const handleExportPDF = () => {
    const element = document.getElementById(`report-print-area-${company.credit_code}`);
    if (!element) {
      alert('Print area not found!');
      return;
    }

    // 1. 保存当前网页
    const originalBody = document.body.innerHTML;

    // 2. 制作纯净的打印页（白底黑字，只放这一家公司的数据）
    const printContent = `<div style="background: white; color: black; padding: 40px; font-family: sans-serif;">${element.innerHTML}</div>`;
    
    // 3. 覆盖整个网页
    document.body.innerHTML = printContent;

    // 4. 调出打印
    window.print();

    // 5. 恢复网页
    setTimeout(() => {
      document.body.innerHTML = originalBody;
      window.location.reload();
    }, 500);
  };

  const riskTone =
    report?.risk_level_en === 'High Risk'
      ? 'text-chop border-chop-dim'
      : report?.risk_level_en === 'Medium Risk'
        ? 'text-amber border-amber'
        : 'text-jade border-jade-dim';

  const renderRow = (field: FieldDef) => {
    const raw = report ? report[field.key] : undefined;
    const value =
      raw == null || raw === ''
        ? '-'
        : Array.isArray(raw)
          ? raw.join(' · ')
          : String(raw);

    const masked = !unlocked && field.sensitive;
    const isLegalPerson = field.key === 'legal_person_en';

    return (
      <div key={field.key} className="flex flex-col gap-1 px-5 py-3.5 sm:flex-row sm:gap-6">
        <span className="text-[11px] uppercase tracking-wide text-muted sm:w-56 sm:shrink-0">
          {field.label}
        </span>
        <span
          className={
            masked ? 'select-none text-sm text-foreground blur-[5px]' : 'text-sm text-foreground'
          }
        >
          {loading && !report ? (
            <span className="text-muted animate-pulse">Loading…</span>
          ) : (
            <>
              {value}
              {isLegalPerson && company.legal_person ? (
                <span className="ml-2 text-muted">/ {company.legal_person}</span>
              ) : null}
            </>
          )}
        </span>
      </div>
    );
  };

  return (
    <section className="mt-4">
      {/* 🔥 这里非常重要，我们给这份报告的所有内容包裹了一个独一无二的 ID */}
      <div id={`report-print-area-${company.credit_code}`}>
        
        <div className="flex flex-col gap-3 border-b border-line pb-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="font-serif text-lg font-medium text-paper sm:text-xl">
              {company.name_en || company.name}
            </h2>
            <div className="text-sm text-muted mt-1">
              {company.name}
            </div>
            <div className="mt-2 font-mono text-xs text-muted">
              Unified credit code: <span className="text-foreground">{company.credit_code}</span>
            </div>
            <div className="mt-1.5 font-mono text-xs text-muted">
              EST. {company.establish_date} · STATUS:{' '}
              <span className={statusStyle(company.status)}>{company.status}</span>
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="mt-4 border border-chop-dim bg-chop/10 p-3 text-xs text-chop">
            {errorMsg}
          </div>
        )}

        {verifying && (
          <div className="mt-8 flex flex-col items-center justify-center py-12 border border-line bg-panel/50">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-chop mb-4"></div>
            <p className="text-sm text-foreground font-medium animate-pulse">
              Verifying your payment...
            </p>
            <p className="mt-2 text-xs text-muted">
              This may take a minute (especially for WeChat Pay). Please wait and do not close this page.
            </p>
          </div>
        )}

        {needPay && !unlocked && !verifying && (
          <div className="mt-5 flex flex-col items-start gap-4 border border-chop-dim bg-gradient-to-b from-chop/[0.08] to-chop/[0.02] px-6 py-8 sm:py-10">
            <p className="text-sm leading-relaxed text-foreground">
              You have used all 3 free lookups this week. Pay to unlock the full report.
            </p>
            <button
              onClick={onUnlock}
              disabled={loading}
              className="w-full whitespace-nowrap bg-chop px-6 py-3.5 text-sm font-semibold text-paper transition-colors hover:bg-[#D1442E] disabled:opacity-50 sm:w-auto"
            >
               {loading ? 'Loading...' : 'Unlock full report — $9.9'}
            </button>
          </div>
        )}

        {(!needPay || unlocked) && !verifying && report && (
          <>
            {remainingFree !== null && !unlocked && (
              <div className="mt-4 text-xs font-mono text-muted">
                Free lookups remaining this week: {remainingFree}
              </div>
            )}

            <div className="mt-5 flex flex-col gap-4 border border-line bg-panel p-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className={`border px-2.5 py-1 text-xs font-semibold ${riskTone}`}>
                  {report.risk_level_en}
                </span>
                <span className="text-xs text-muted">{report.risk_level_cn}</span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <div className="text-[11px] uppercase tracking-wide text-jade">Highlights</div>
                  <ul className="mt-2 space-y-1 text-sm text-foreground">
                    {(report.highlights_en || []).map((h, i) => (
                      <li key={i}>· {h}</li>
                    ))}
                  </ul>
                  <div className="mt-1.5 text-xs text-muted">
                    {(report.highlights_cn || []).join(' · ')}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] uppercase tracking-wide text-chop">Risk points</div>
                  <ul className="mt-2 space-y-1 text-sm text-foreground">
                    {(report.risk_points_en || []).map((r, i) => (
                      <li key={i}>· {r}</li>
                    ))}
                  </ul>
                  <div className="mt-1.5 text-xs text-muted">
                    {(report.risk_points_cn || []).join(' · ')}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 border border-line bg-panel2 p-5">
              <div className="text-[11px] uppercase tracking-wide text-muted">
                Comprehensive evaluation
              </div>
              <p className="mt-3 text-sm leading-relaxed text-foreground">{report.evaluation_en}</p>
              <p className="mt-3 border-t border-line pt-3 text-[13px] leading-relaxed text-muted">
                {report.evaluation_cn}
              </p>
            </div>

            <div className="mt-4 divide-y divide-line border border-line">
              {BASIC_FIELDS.map(renderRow)}
              {CAPITAL_FIELDS.map(renderRow)}
              {COMPLIANCE_FIELDS.map(renderRow)}
            </div>
          </>
        )}
      </div> {/* 🔥 包裹结束 */}

      {/* 底部状态栏（它不包含在打印区域的 ID 里，所以打印时会被去掉） */}
      {!needPay && !verifying && report && (
        !unlocked ? (
          <div className="mt-4 flex flex-col items-start gap-4 border border-chop-dim bg-gradient-to-b from-chop/[0.08] to-chop/[0.02] px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-sm text-[13px] leading-relaxed text-muted">
              <strong className="font-semibold text-foreground">Full report — $9.9.</strong> Unlocks
              shareholders, enforcement detail, address classification, and a bilingual AI risk
              narrative.
            </p>
            <button
              onClick={onUnlock}
              disabled={loading}
              className="w-full whitespace-nowrap bg-chop px-6 py-3.5 text-sm font-semibold text-paper transition-colors hover:bg-[#D1442E] disabled:opacity-50 sm:w-auto"
            >
              {loading ? 'Loading...' : 'Unlock full report — $9.9'}
            </button>
          </div>
        ) : (
          <div className="mt-4 flex flex-col items-start gap-4 border border-jade-dim bg-jade/[0.08] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[13px] text-jade">Report unlocked · saved to your query history</p>
            <button 
              onClick={handleExportPDF}
              className="w-full whitespace-nowrap border border-jade px-5 py-3 text-sm font-semibold text-jade transition-colors hover:bg-jade/[0.12] sm:w-auto"
            >
              Export as PDF
            </button>
          </div>
        )
      )}
    </section>
  );
}