import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'KERNEL PANIC — 404 | PORTFOLIO_OS',
  description: 'The requested path does not exist in the file system.',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main
      className="min-h-screen bg-void text-matrix-green font-mono flex flex-col items-center justify-center p-8"
      aria-labelledby="error-heading"
    >
      {/* CRT scanline overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-50 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.08)_2px,rgba(0,0,0,0.08)_4px)]"
        aria-hidden="true"
      />

      <div className="w-full max-w-2xl space-y-6">
        {/* Boot header */}
        <div className="border border-matrix-green/40 bg-component p-4 space-y-1">
          <p className="text-cyber-orange text-sm">
            [KERNEL] CRIT — Segmentation fault (core dumped)
          </p>
          <p className="text-matrix-green/60 text-xs">
            pid: 404 &nbsp;|&nbsp; signal: SIGSEGV &nbsp;|&nbsp; addr: 0x00000000
          </p>
        </div>

        {/* Error body */}
        <div className="border border-matrix-green/30 bg-component p-6 space-y-4">
          <div className="space-y-1">
            <p className="text-cyber-orange font-bold text-lg" id="error-heading">
              KERNEL PANIC — NOT SYNCING
            </p>
            <p className="text-matrix-green/80 text-sm">
              Fatal exception in route resolution subsystem.
            </p>
          </div>

          <div className="text-matrix-green/50 text-xs space-y-px leading-relaxed">
            <p>Call trace:</p>
            <p className="pl-4">[&lt;ffffffff&gt;] resolve_path+0x404/0x404</p>
            <p className="pl-4">[&lt;ffffffff&gt;] next_router_dispatch+0x1a/0x30</p>
            <p className="pl-4">[&lt;ffffffff&gt;] do_page_fault+0x0/0x404</p>
            <p className="pl-4">[&lt;ffffffff&gt;] page_fault+0x28/0x30</p>
          </div>

          <div className="border-t border-matrix-green/20 pt-4 space-y-1">
            <p className="text-warn-yellow text-sm">
              [SYS_ADMIN] WARN — Path not found in filesystem registry.
            </p>
            <p className="text-matrix-green/60 text-xs break-all">
              The requested resource does not exist. Check the path and retry.
            </p>
          </div>
        </div>

        {/* Recovery prompt */}
        <div className="border border-matrix-green/30 bg-component p-4 space-y-3">
          <p className="text-matrix-green/60 text-xs">[KERNEL] Attempting automatic recovery…</p>
          <p className="text-matrix-green text-sm">
            <span className="text-matrix-green/40">user@portfolio:~$</span>{' '}
            <span className="animate-pulse">cd /home &amp;&amp; exec portfolio_os</span>
          </p>
          <Link
            href="/"
            className="inline-block mt-2 border border-matrix-green text-matrix-green text-sm px-4 py-2 hover:bg-matrix-green hover:text-void transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-matrix-green focus-visible:outline-offset-2"
            aria-label="Return to portfolio home"
          >
            &gt; REBOOT SYSTEM
          </Link>
        </div>

        {/* Status bar */}
        <p className="text-matrix-green/30 text-xs text-center">
          PORTFOLIO_OS v0.1.0 &nbsp;—&nbsp; kernel: 6.1.0-portfolio &nbsp;—&nbsp; exit code: 404
        </p>
      </div>
    </main>
  );
}
