import { NextResponse } from 'next/server';
import { initializeDefaults, isKvConfigured } from '@/lib/kv';

export async function POST() {
  try {
    if (!isKvConfigured()) {
      return NextResponse.json({
        ok: false,
        error: 'Vercel KV nie jest skonfigurowany. Dodaj bazę KV w panelu Vercel.',
      }, { status: 503 });
    }

    const result = await initializeDefaults();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Init error:', error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
