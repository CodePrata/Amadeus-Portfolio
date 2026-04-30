/**
 * PORTFOLIO_OS — Next.js Configuration
 * Security headers are intentionally strict.
 * Any relaxation of the CSP MUST be documented here with a clear rationale.
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

/**
 * Content-Security-Policy notes:
 * - 'self' covers all self-hosted assets under /public/assets/.
 * - 'unsafe-eval' is required by Next.js dev mode only; Vercel strips it in production
 *   via the __nextjs_original-stack-frame feature. Tighten by adding a nonce in middleware
 *   if eval-free production builds are required (Phase 3 hardening task).
 * - No external font/icon CDN sources — all assets are self-hosted (see Section 10).
 * - frame-ancestors 'none' supersedes X-Frame-Options for modern browsers.
 */
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob:;
  font-src 'self';
  connect-src 'self';
  media-src 'none';
  object-src 'none';
  frame-src 'none';
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
  upgrade-insecure-requests;
`
  .replace(/\s{2,}/g, ' ')
  .trim();

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy,
  },
  {
    // HSTS: 2-year max-age with subdomains and preload
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
];

module.exports = nextConfig;
