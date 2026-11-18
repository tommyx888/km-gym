import { NextRequest, NextResponse } from 'next/server';
import { unsubscribeByToken } from '@/lib/newsletter';

export const dynamic = 'force-dynamic';

/** GET ?token= – odhlásenie z newslettra (odkaz v päte každého e‑mailu). */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token') ?? '';
  const r = await unsubscribeByToken(token);
  return NextResponse.redirect(r.redirect, 303);
}
