import { NextResponse } from 'next/server';
import { TESTFLIGHT_URL } from '@/lib/site';

export const dynamic = 'force-dynamic';

export function GET() {
  return NextResponse.redirect(TESTFLIGHT_URL, 307);
}
