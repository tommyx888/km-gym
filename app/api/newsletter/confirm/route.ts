import { NextRequest, NextResponse } from 'next/server';
import { confirmByToken } from '@/lib/newsletter';

export const dynamic = 'force-dynamic';

/** GET ?token= – potvrdenie odberu (odkaz z e‑mailu) → presmeruje na /newsletter?status=… */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token') ?? '';
  const r = await confirmByToken(token);
  return NextResponse.redirect(r.redirect, 303);
}
