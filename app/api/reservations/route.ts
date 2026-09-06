import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin, isSupabaseConfigured, RESERVATIONS_TABLE, supabase } from '@/lib/supabase';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^\d{2}:\d{2}$/;

/** POST – vytvorenie rezervácie (logika z pôvodnej verzie, pridaná validácia formátu a locale). */
export async function POST(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: 'Supabase nie je nakonfigurovaný. Nastav NEXT_PUBLIC_SUPABASE_URL a NEXT_PUBLIC_SUPABASE_ANON_KEY.' },
        { status: 500 },
      );
    }

    const body = await request.json();
    const { name, email, phone, date, time, locale, company } = body ?? {};

    // honeypot – tichý „úspech“, aby bot nevedel, že bol odhalený
    if (typeof company === 'string' && company.length > 0) {
      return NextResponse.json({ message: 'ok' }, { status: 201 });
    }

    if (!name || !email || !date || !time) {
      return NextResponse.json({ error: 'Všetky povinné polia musia byť vyplnené' }, { status: 400 });
    }
    if (typeof name !== 'string' || name.trim().length < 2 || name.length > 120) {
      return NextResponse.json({ error: 'Neplatné meno' }, { status: 400 });
    }
    if (typeof email !== 'string' || !EMAIL_RE.test(email) || email.length > 200) {
      return NextResponse.json({ error: 'Neplatná emailová adresa' }, { status: 400 });
    }
    if (!DATE_RE.test(String(date)) || !TIME_RE.test(String(time))) {
      return NextResponse.json({ error: 'Neplatný dátum alebo čas' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from(RESERVATIONS_TABLE)
      .insert([
        {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone ? String(phone).trim() : null,
          date,
          time,
          locale: locale === 'en' ? 'en' : 'sk',
        },
      ])
      .select('id, date, time');

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Chyba pri ukladaní rezervácie do databázy' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Rezervácia bola úspešne vytvorená', data }, { status: 201 });
  } catch (error) {
    console.error('Error processing reservation:', error);
    return NextResponse.json({ error: 'Interná chyba servera' }, { status: 500 });
  }
}

/**
 * GET – zoznam rezervácií (?date=YYYY-MM-DD).
 * Číta cez service-role kľúč (server only). Bez neho vráti 503 – verejný kľúč
 * zámerne nemá právo čítať osobné údaje.
 */
export async function GET(request: NextRequest) {
  try {
    const admin = getSupabaseAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: 'Čítanie rezervácií vyžaduje SUPABASE_SERVICE_ROLE_KEY na serveri.' },
        { status: 503 },
      );
    }

    const date = request.nextUrl.searchParams.get('date');
    let query = admin.from(RESERVATIONS_TABLE).select('*');
    if (date) query = query.eq('date', date);

    const { data, error } = await query.order('date', { ascending: true }).order('time', { ascending: true });
    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Chyba pri načítaní rezervácií' }, { status: 500 });
    }
    return NextResponse.json({ reservations: data }, { status: 200 });
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return NextResponse.json({ error: 'Interná chyba servera' }, { status: 500 });
  }
}
