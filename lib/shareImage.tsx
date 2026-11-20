import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

export const SHARE_IMAGE_SIZE = { width: 1200, height: 630 };

// The 1200x630 link preview: wordmark, a two-line tagline (the second in
// lime) and the lineup screenshot. Longer taglines, like article headings,
// take a smaller font size and a text width that leaves the screenshot room.
export async function shareImage(
  tagline: readonly [string, string],
  { fontSize = 76, textWidth }: { fontSize?: number; textWidth?: number } = {}
) {
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
            ...(textWidth && { width: textWidth }),
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
              fontSize,
              lineHeight: 1.08,
              letterSpacing: -2,
            }}
          >
            <span>{tagline[0]}</span>
            <span style={{ color: '#D4FF3A' }}>{tagline[1]}</span>
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
    SHARE_IMAGE_SIZE
  );
}
