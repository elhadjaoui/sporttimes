/* eslint-disable no-console */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

async function main() {
  const url = process.env.OG_URL ?? 'http://localhost:3000/og-preview';
  const out = resolve(process.cwd(), 'public/og/sporttimes-og.png');

  await mkdir(resolve(process.cwd(), 'public/og'), { recursive: true });

  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1200, height: 630 } });
  const page = await ctx.newPage();

  await page.goto(url, { waitUntil: 'networkidle' });
  // Give the PitchFill animation time to finish (~2.5s) + buffer.
  await page.waitForTimeout(3500);

  await page.screenshot({ path: out, clip: { x: 0, y: 0, width: 1200, height: 630 } });

  await browser.close();
  console.log(`OG image written to ${out}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
