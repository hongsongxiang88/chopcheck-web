import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

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
  const unlockKey = `unlock:${userId}:${companyId}:${week}`;

  // TODO: 这里加支付验证（比如校验支付网关返回的签名）
  // 目前仅演示，正式环境请务必校验支付结果

  await redis.set(unlockKey, '1', { ex: 7 * 24 * 60 * 60 });

  return NextResponse.json({ success: true });
}