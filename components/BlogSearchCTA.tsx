'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SearchBar from './SearchBar';

export default function BlogSearchCTA() {
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 🔥 修改点：不需要接收 e 参数，直接匹配 SearchBar 的 Props 类型
  const handleSearch = () => {
    if (!keyword.trim()) return;

    setLoading(true);
    // 带着搜索词跳转回主页，主页的 useEffect 会自动捕获 ?q= 并发起搜索
    router.push(`/?q=${encodeURIComponent(keyword.trim())}`);
  };

  return (
    <div className="mt-16 border-t border-line pt-10">
      <div className="mx-auto max-w-2xl text-center">
        <h3 className="font-serif text-2xl font-medium text-paper sm:text-3xl">
          Don&apos;t wire the deposit blindly.
        </h3>
        <p className="mt-3 text-sm text-muted">
          Search any Chinese company name right here to check their identity and risk indicators before you pay.
        </p>
        
        <div className="mt-6">
          {/* 复用你的 SearchBar 组件，包裹在视觉容器中 */}
          <div className="rounded-sm border border-line bg-panel p-2">
            <SearchBar 
              value={keyword} 
              onChange={setKeyword} 
              onSubmit={handleSearch} 
              loading={loading} 
            />
          </div>
        </div>
        
        <p className="mt-3 text-[13px] text-muted">
          Get <strong className="text-paper font-semibold">3 free lookups a week</strong>. No account needed.
        </p>
      </div>
    </div>
  );
}