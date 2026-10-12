// lib/api.ts
import type { Company } from '@/lib/types';

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