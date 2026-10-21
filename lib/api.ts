// lib/api.ts
import type { Company } from '@/lib/types';

// lib/api.ts（在原有基础上追加）
export type CheckLimitResult = {
  canView: boolean;
  isPaidView: boolean;
  remainingFree: number | null;
  needPay?: boolean;
  message?: string;
};

/** 检查本周是否还能查看 */
export async function checkViewLimit(userId: string, companyId: string): Promise<CheckLimitResult> {
  const res = await fetch('/api/check-limit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, companyId }),
  });

  // 402 也返回 JSON，不能直接 throw
  const data = await res.json();
  return data as CheckLimitResult;
}

/** 付款后解锁本次查看 */
export async function unlockReport(userId: string, companyId: string) {
  const res = await fetch('/api/unlock', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, companyId }),
  });
  if (!res.ok) throw new Error('Unlock failed');
  return res.json();
}

/**
 * 根据统一社会信用代码获取尽调报告数据
 * 注意：这里请求的是 Next.js 自己的 API 代理路由，而不是直接请求阿里云 FC
 */
export async function fetchDueDiligenceReport(creditCode: string) {
  if (!creditCode) {
    throw new Error('Credit code is required');
  }

  // 请求本地代理
  const response = await fetch(`/api/due-diligence?credit_code=${encodeURIComponent(creditCode)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to fetch report: ${response.statusText}`);
  }

  return await response.json();
}