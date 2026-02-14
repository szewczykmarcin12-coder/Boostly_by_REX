import { NextResponse } from 'next/server';
import { getNotifications } from '@/lib/kv';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const notifications = await getNotifications();
    return NextResponse.json({ notifications });
  } catch (error) {
    console.error('Notifications fetch error:', error);
    return NextResponse.json({ notifications: [] }, { status: 500 });
  }
}
