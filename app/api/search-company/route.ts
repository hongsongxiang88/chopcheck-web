import { NextRequest, NextResponse } from 'next/server';

// 部署时把真实地址放进 .env.local 的 ALIYUN_SEARCH_URL,不要硬编码在代码里提交到仓库
const ALIYUN_SEARCH_URL =
  process.env.ALIYUN_SEARCH_URL ||
  'https://duedilicesearch-vhrxmciukl.cn-hangzhou.fcapp.run/api/v1/search-company';

export async function POST(req: NextRequest) {
  let keyword = '';

  try {
    const body = await req.json();
    keyword = (body?.company_keyword ?? '').toString().trim();
  } catch {
    return NextResponse.json({ error: '请求格式不正确' }, { status: 400 });
  }

  if (!keyword) {
    return NextResponse.json({ error: '关键词不能为空' }, { status: 400 });
  }

  try {
    const upstream = await fetch(ALIYUN_SEARCH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        // 阿里云FC测试脚本里带了这个头,保留以避免网关侧的时间戳校验问题
        Date: new Date().toUTCString(),
      },
      body: JSON.stringify({ company_keyword: keyword }),
      // FC 冷启动可能较慢,给足超时时间;当前 Node 版本原生支持 AbortSignal.timeout
      signal: AbortSignal.timeout(25_000),
      cache: 'no-store',
    });

    const text = await upstream.text();
    let data: unknown;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      return NextResponse.json(
        { error: '上游服务返回了无法解析的数据', detail: text.slice(0, 300) },
        { status: 502 },
      );
    }

    if (!upstream.ok) {
      return NextResponse.json(
        {
          error: `查询服务暂时不可用 (${upstream.status})`,
          detail:
            typeof data === 'object' && data !== null && 'detail' in data
              ? String((data as { detail?: unknown }).detail)
              : undefined,
        },
        { status: 502 },
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    const isTimeout =
      err instanceof Error && (err.name === 'TimeoutError' || err.name === 'AbortError');
    return NextResponse.json(
      { error: isTimeout ? '查询超时,请稍后重试' : '请求失败,请检查网络后重试' },
      { status: 502 },
    );
  }
}
