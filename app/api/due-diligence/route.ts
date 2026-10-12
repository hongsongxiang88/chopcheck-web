// app/api/due-diligence/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const creditCode = searchParams.get('credit_code');

  if (!creditCode) {
    return NextResponse.json({ error: 'Credit code is required' }, { status: 400 });
  }

  const ALIYUN_FC_URL = process.env.ALIYUN_FC_URL || 'https://duediligence-txpgirqcbm.cn-hangzhou.fcapp.run';

  try {
    // 由 Next.js 服务端去请求 FC，不受浏览器 CORS 限制
    const response = await fetch(`${ALIYUN_FC_URL}/api/v1/enterprise/info?credit_code=${encodeURIComponent(creditCode)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: `FC error: ${response.statusText}` }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}