// app/api/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Paddle, Environment } from '@paddle/paddle-node-sdk';

const paddle = new Paddle(process.env.PADDLE_API_KEY!, {
  environment: process.env.NEXT_PUBLIC_PADDLE_ENV === 'sandbox' 
    ? Environment.sandbox 
    : Environment.production,
});

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
      // 从 customData 中取出你在前端传入的 userId 和 companyId
      const { userId, companyId } = transaction.customData || {};
      
      if (userId && companyId) {
        // 🔥 在这里写入你的数据库解锁逻辑
        // 例如：await db.unlockReport(userId, companyId);
        console.log(`Unlocked report for user ${userId}, company ${companyId}`);
      }
    }
    
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }
}