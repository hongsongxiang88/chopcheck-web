// app/api/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Paddle, Environment } from '@paddle/paddle-node-sdk';
import { Redis } from '@upstash/redis';

// 🔥 初始化 Redis
const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const paddle = new Paddle(process.env.PADDLE_API_KEY!, {
  environment: process.env.NEXT_PUBLIC_PADDLE_ENV === 'sandbox' 
    ? Environment.sandbox 
    : Environment.production,
});

// 保持与 check-limit 相同的周数格式
function getWeekKey() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const days = Math.floor((now.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
  const week = Math.ceil((days + start.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${week}`;
}

export async function POST(req: NextRequest) {
  const signature = req.headers.get('paddle-signature') || '';
  const secret = process.env.PADDLE_NOTIFICATION_WEBHOOK_SECRET || '';
  
  // 必须用 text()，不能用 json()
  const body = await req.text(); 

  try {
    const event = await paddle.webhooks.unmarshal(body, secret, signature);
    
    // 监听交易完成事件
    if (event.eventType === 'transaction.completed') {
      const transaction = event.data;
      const { userId, companyId } = transaction.customData || {};
      
      if (userId && companyId) {
        // 1. 防重机制：检查这笔订单是否已经处理过
        const txKey = `paddle_tx:${transaction.id}`;
        const isProcessed = await redis.get(txKey);
        
        if (isProcessed) {
          console.log(`[Webhook] Transaction ${transaction.id} already processed.`);
          return NextResponse.json({ received: true });
        }

        // 2. 生成与 check-limit 一致的 unlockKey
        const week = getWeekKey();
        const unlockKey = `unlock:${userId}:${companyId}:${week}`;
        
        // 3. 真正写入 Redis，设置 7 天过期
        await redis.set(unlockKey, '1', { ex: 7 * 24 * 60 * 60 });
        // 4. 记录该订单已处理，设置 7 天过期
        await redis.set(txKey, '1', { ex: 7 * 24 * 60 * 60 });
        
        console.log(`[Webhook] ✅ 支付成功并已写入 Redis: ${unlockKey}`);
      } else {
        console.warn(`[Webhook] ⚠️ 交易完成，但缺少 customData`, transaction.id);
      }
    }
    
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('[Webhook] 验证或处理失败:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }
}