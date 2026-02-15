import { NextResponse } from 'next/server';
import { put, del } from '@vercel/blob';
import { getAdminPin } from '@/lib/kv';

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    // Check blob token
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        { error: 'Vercel Blob nie jest skonfigurowany. Dodaj Blob Store w panelu Vercel → Storage.' },
        { status: 503 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const adminPin = formData.get('adminPin');

    // Verify admin
    if (!adminPin) {
      return NextResponse.json({ error: 'Brak PIN-u administratora' }, { status: 401 });
    }
    const correctPin = await getAdminPin();
    if (adminPin !== correctPin) {
      return NextResponse.json({ error: 'Nieprawidłowy PIN administratora' }, { status: 403 });
    }

    // Validate file
    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'Nie przesłano pliku' }, { status: 400 });
    }

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json({ error: 'Dozwolone są tylko pliki PDF' }, { status: 400 });
    }

    // Max 50MB
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: 'Plik jest za duży (max 50MB)' }, { status: 400 });
    }

    // Upload to Vercel Blob
    const blob = await put(`documents/${file.name}`, file, {
      access: 'public',
      addRandomSuffix: true, // prevents filename collisions
    });

    return NextResponse.json({
      ok: true,
      url: blob.url,
      filename: file.name,
      size: file.size,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Błąd uploadu: ' + error.message }, { status: 500 });
  }
}
