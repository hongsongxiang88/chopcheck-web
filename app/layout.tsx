import type { Metadata } from 'next';
import { Fraunces, IBM_Plex_Sans } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-fraunces',
});

const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-plex-sans',
});

// 🔥 这里改成了引入本地字体
const plexMono = localFont({
  // 路径指向你刚才放置的 .ttf 文件
  src: './fonts/JetBrainsMono-VariableFont_wght.ttf',
  variable: '--font-plex-mono',
  display: 'swap',
  // 可变字体指定字重范围
  weight: '400 600',
});

export const metadata: Metadata = {
  title: 'ChopCheck — Supplier Verification',
  description: 'Verify the company before you wire the deposit.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${plexSans.variable} ${plexMono.variable}`}
    >
      <body className="bg-ink font-sans text-foreground">{children}</body>
    </html>
  );
}