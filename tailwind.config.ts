import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/app/**/*.{js,ts,jsx,tsx,mdx}', './src/components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // ── Backgrounds ──────────────────────────────────────────────
        void: '#000000', // Main page background
        component: '#0D0D0D', // Sidebar, card backgrounds
        'card-hover': '#121212', // Card hover state

        // ── Accents ───────────────────────────────────────────────────
        'matrix-green': '#00FF41', // Primary accent — CLI, sidebar border, default glow
        'cyber-orange': '#FF5F00', // KERNEL log channel / warning / CRIT
        'app-cyan': '#00CCFF', // APP_DEV log channel
        'warn-yellow': '#FFD700', // SYS_ADMIN log channel
      },

      fontFamily: {
        mono: [
          'JetBrains Mono',
          'Fira Code',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'Liberation Mono',
          'Courier New',
          'monospace',
        ],
      },

      // ── Log channel to colour utility classes ───────────────────────
      // Used as: text-channel-kernel, border-channel-sec-ops, etc.
      // These mirror the log channel → colour mapping in .cursorrules §3.
      textColor: {
        'channel-kernel': '#FF5F00',
        'channel-sec-ops': '#00FF41',
        'channel-app-dev': '#00CCFF',
        'channel-sys-admin': '#FFD700',
      },

      // ── Glow / shadow utilities ──────────────────────────────────────
      boxShadow: {
        'glow-green': '0 0 8px #00FF41, 0 0 16px #00FF4133',
        'glow-orange': '0 0 8px #FF5F00, 0 0 16px #FF5F0033',
        'glow-cyan': '0 0 8px #00CCFF, 0 0 16px #00CCFF33',
        'glow-yellow': '0 0 8px #FFD700, 0 0 16px #FFD70033',
      },

      // ── Animation ────────────────────────────────────────────────────
      keyframes: {
        // Defined here as tokens; full keyframe bodies live in globals.css
        // so they can reference CSS custom properties and be toggled via
        // the cleanModeEnabled Zustand flag.
        'crt-flicker': {
          '0%, 100%': { opacity: '1' },
          '92%': { opacity: '1' },
          '93%': { opacity: '0.85' },
          '94%': { opacity: '1' },
          '96%': { opacity: '0.9' },
          '98%': { opacity: '1' },
        },
        'scan-line': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        'blink-cursor': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        'boot-fade-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'crt-flicker': 'crt-flicker 8s infinite',
        'scan-line': 'scan-line 6s linear infinite',
        'blink-cursor': 'blink-cursor 1s step-end infinite',
        'boot-fade-in': 'boot-fade-in 0.4s ease-out both',
      },
    },
  },
  plugins: [],
};

export default config;
