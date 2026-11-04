// app/api/check-limit/route.ts
import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

// 🔥 强制兼容 Vercel KV 和 Upstash 两种环境变量名
const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN!,
});

function getWeekKey() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const days = Math.floor((now.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
  const week = Math.ceil((days + start.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${week}`;
}

export async function POST(req: Request) {
  const { userId, companyId } = await req.json();
  if (!userId || !companyId) {
    return NextResponse.json({ error: 'userId and companyId required' }, { status: 400 });
  }

  const week = getWeekKey();
  const freeKey = `view:week:${userId}`;
  const unlockKey = `unlock:${userId}:${companyId}:${week}`;

  try {
    // 1) 已付款解锁本次？
    const isUnlocked = await redis.get(unlockKey);
    if (isUnlocked === '1' || isUnlocked === 1) {
      return NextResponse.json({
        canView: true,
        isPaidView: true,
        remainingFree: null,
        needPay: false,
      });
    }

    // 2) 读本周已查看次数
    let freeCount = (await redis.get<number>(freeKey)) ?? 0;

    // 3) 前 3 次 → 计数 +1，可以查看（部分遮住由 FC 返回）
    if (freeCount < 3) {
      const newCount = freeCount + 1;
      await redis.set(freeKey, newCount, { ex: 7 * 24 * 60 * 60 });
      return NextResponse.json({
        canView: true,
        isPaidView: false,
        remainingFree: 3 - newCount,
        needPay: false,
      });
    }

    // 4) 第 4 次及以后 → 不调 FC，直接返回付款提示
    return NextResponse.json({
      canView: false,
      isPaidView: false,
      needPay: true,
      message: 'You have used all 3 free lookups this week. Pay to unlock the full report.',
    }, { status: 402 });
  } catch (err) {
    console.error('Redis or check-limit error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}