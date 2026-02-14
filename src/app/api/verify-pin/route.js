import { NextResponse } from 'next/server';
import { getUserPin, getAdminPin } from '@/lib/kv';

export async function POST(request) {
  try {
    const { pin, mode } = await request.json();

    if (!pin || pin.length !== 6) {
      return NextResponse.json({ valid: false, error: 'PIN musi składać się z 6 cyfr' }, { status: 400 });
    }

    if (mode === 'admin') {
      const adminPin = await getAdminPin();
      return NextResponse.json({ valid: pin === adminPin });
    } else {
      const userPin = await getUserPin();
      return NextResponse.json({ valid: pin === userPin });
    }
  } catch (error) {
    console.error('PIN verification error:', error);
    return NextResponse.json({ valid: false, error: 'Błąd serwera' }, { status: 500 });
  }
}
