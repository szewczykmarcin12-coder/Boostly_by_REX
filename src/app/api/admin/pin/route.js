import { NextResponse } from 'next/server';
import { getAdminPin, getUserPin, setUserPin, setAdminPin, isKvConfigured } from '@/lib/kv';

export async function POST(request) {
  try {
    if (!isKvConfigured()) {
      return NextResponse.json(
        { error: 'Baza danych nie jest skonfigurowana. Skonfiguruj Vercel KV.' },
        { status: 503 }
      );
    }

    const { adminPin, action, newPin } = await request.json();

    // Verify admin
    const correctAdminPin = await getAdminPin();
    if (adminPin !== correctAdminPin) {
      return NextResponse.json({ error: 'Nieprawidłowy PIN administratora' }, { status: 403 });
    }

    if (!newPin || newPin.length !== 6 || !/^\d{6}$/.test(newPin)) {
      return NextResponse.json({ error: 'PIN musi składać się z 6 cyfr' }, { status: 400 });
    }

    if (action === 'changeUserPin') {
      await setUserPin(newPin);
      return NextResponse.json({ ok: true, message: 'PIN użytkownika został zmieniony' });
    }

    if (action === 'changeAdminPin') {
      await setAdminPin(newPin);
      return NextResponse.json({ ok: true, message: 'PIN administratora został zmieniony' });
    }

    return NextResponse.json({ error: 'Nieznana akcja' }, { status: 400 });
  } catch (error) {
    console.error('PIN change error:', error);
    return NextResponse.json({ error: 'Błąd serwera' }, { status: 500 });
  }
}

// GET: return current user PIN for admin (to display in admin panel)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const adminPin = searchParams.get('adminPin');

    const correctAdminPin = await getAdminPin();
    if (adminPin !== correctAdminPin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const userPin = await getUserPin();
    return NextResponse.json({ userPin });
  } catch (error) {
    return NextResponse.json({ error: 'Błąd serwera' }, { status: 500 });
  }
}
