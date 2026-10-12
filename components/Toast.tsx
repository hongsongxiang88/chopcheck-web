'use client';

type Props = {
  message: string | null;
};

export default function Toast({ message }: Props) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-7 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap bg-paper px-5 py-3.5 text-sm font-medium text-ink transition-all duration-300 ${
        message ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
      }`}
    >
      {message}
    </div>
  );
}
