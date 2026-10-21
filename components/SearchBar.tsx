'use client';

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  loading: boolean;
};

export default function SearchBar({ value, onChange, onSubmit, loading }: Props) {
  return (
    <div>
      <div className="flex border border-line bg-panel">
        <input
          id="search-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSubmit();
          }}
          placeholder="e.g. Oracle or 91330200123456789X or 拼多多"
          className="flex-1 bg-transparent px-4 py-4 text-[15px] text-foreground outline-none placeholder:text-muted sm:px-5"
        />
        <button
          onClick={onSubmit}
          disabled={loading}
          className="whitespace-nowrap bg-paper px-5 text-sm font-semibold text-ink transition-colors hover:bg-white disabled:opacity-60 sm:px-6"
        >
          {loading ? 'Searching…' : 'Search'}
        </button>
      </div>
    </div>
  );
}
