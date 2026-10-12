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
          placeholder="e.g. Zijing Trading, Ningbo Ocean Plastics…"
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
      <p className="mt-2.5 text-xs text-muted">
        Try &quot;zijing&quot; — 3 free lookups a day, no account needed.
      </p>
    </div>
  );
}
