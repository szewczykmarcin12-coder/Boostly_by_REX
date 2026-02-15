import { NextResponse } from 'next/server';
import { getFullConfig, isKvConfigured, isBlobConfigured } from '@/lib/kv';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const config = await getFullConfig();
    return NextResponse.json({
      ...config,
      kvConfigured: isKvConfigured(),
      blobConfigured: isBlobConfigured(),
    });
  } catch (error) {
    console.error('Config fetch error:', error);
    return NextResponse.json({ error: 'Błąd serwera' }, { status: 500 });
  }
}
