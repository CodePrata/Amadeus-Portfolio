import type { Metadata } from 'next';

import { ShellFrame } from '@/components/layout/ShellFrame';
import { SITE_DESCRIPTION, SITE_TITLE } from '@/data/constants';

import './globals.css';

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-void font-mono text-matrix-green antialiased">
        <ShellFrame>{children}</ShellFrame>
      </body>
    </html>
  );
}
