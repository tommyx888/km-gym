import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Obnoví Supabase session (cookies) pri každom requeste a vráti používateľa.
 * Používa proxy.ts na ochranu členskej zóny.
 */
export async function updateSession(request: NextRequest, response: NextResponse) {
  let res = response;
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        res = NextResponse.next({ request });
        response.cookies.getAll().forEach((c) => res.cookies.set(c));
        cookiesToSet.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
      },
    },
  });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { response: res, user };
}
