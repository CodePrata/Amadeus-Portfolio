import { ImageResponse } from 'next/og';

import { OWNER_NAME, OWNER_TITLE, OWNER_HANDLE, SITE_TITLE } from '@/data/constants';

export const runtime = 'edge';

export const alt = `${OWNER_NAME} — Cybersecurity Portfolio`;

export const size = { width: 1200, height: 630 };

export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    <div
      style={{
        width: '1200px',
        height: '630px',
        backgroundColor: '#000000',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: '"Courier New", Courier, monospace',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Scanline overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.12) 2px, rgba(0,0,0,0.12) 4px)',
          pointerEvents: 'none',
        }}
      />

      {/* Left accent bar */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '4px',
          backgroundColor: '#00FF41',
        }}
      />

      {/* Top border */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          backgroundColor: 'rgba(0,255,65,0.3)',
        }}
      />

      {/* Content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '56px 72px',
          gap: '0px',
          flex: 1,
        }}
      >
        {/* System header bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '48px',
          }}
        >
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: '#FF5F00',
            }}
          />
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: '#FFD700',
            }}
          />
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: '#00FF41',
            }}
          />
          <span
            style={{
              color: 'rgba(0,255,65,0.4)',
              fontSize: '13px',
              marginLeft: '12px',
              letterSpacing: '0.08em',
            }}
          >
            PORTFOLIO_OS — terminal
          </span>
        </div>

        {/* Log channel badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '20px',
          }}
        >
          <span
            style={{
              color: '#FF5F00',
              fontSize: '13px',
              letterSpacing: '0.12em',
              fontWeight: 700,
            }}
          >
            [KERNEL]
          </span>
          <span style={{ color: 'rgba(0,255,65,0.5)', fontSize: '13px' }}>
            INFO — identity module loaded
          </span>
        </div>

        {/* Owner name */}
        <div
          style={{
            color: '#00FF41',
            fontSize: '72px',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            lineHeight: 1,
            marginBottom: '16px',
            textShadow: '0 0 40px rgba(0,255,65,0.5)',
          }}
        >
          {OWNER_NAME}
        </div>

        {/* Handle */}
        <div
          style={{
            color: 'rgba(0,255,65,0.5)',
            fontSize: '22px',
            letterSpacing: '0.1em',
            marginBottom: '28px',
          }}
        >
          @{OWNER_HANDLE}
        </div>

        {/* Title */}
        <div
          style={{
            color: '#00CCFF',
            fontSize: '22px',
            letterSpacing: '0.04em',
            marginBottom: '40px',
          }}
        >
          {OWNER_TITLE}
        </div>

        {/* Bottom prompt */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: 'auto',
            borderTop: '1px solid rgba(0,255,65,0.15)',
            paddingTop: '24px',
          }}
        >
          <span style={{ color: 'rgba(0,255,65,0.35)', fontSize: '15px' }}>user@portfolio:~$</span>
          <span style={{ color: '#00FF41', fontSize: '15px' }}>./run {SITE_TITLE}</span>
          <span
            style={{
              display: 'inline-block',
              width: '10px',
              height: '18px',
              backgroundColor: '#00FF41',
              marginLeft: '2px',
            }}
          />
        </div>
      </div>
    </div>,
    {
      ...size,
    }
  );
}
