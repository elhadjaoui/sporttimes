import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

export const alt = 'SPORTTIMES. See the lineup. Join the match.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
  const screenshot = await readFile(
    join(process.cwd(), 'public/screens/howitworks-lineup.png')
  );
  const screenshotSrc = `data:image/png;base64,${screenshot.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          padding: '0 96px',
          background: '#050505',
          color: '#F5F5F0',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '100%',
          }}
        >
          <div style={{ fontSize: 26, letterSpacing: 8, color: '#D4FF3A' }}>
            SPORTTIMES
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginTop: 28,
              fontSize: 76,
              lineHeight: 1.08,
              letterSpacing: -2,
            }}
          >
            <span>See the lineup.</span>
            <span style={{ color: '#D4FF3A' }}>Join the match.</span>
          </div>
        </div>
        {/* The negative margin crops placeholder text off the top of the screenshot. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={screenshotSrc}
          alt=""
          width={370}
          height={777}
          style={{ marginTop: -104 }}
        />
      </div>
    ),
    size
  );
}
