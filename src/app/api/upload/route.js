import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { getAdminPin } from '@/lib/kv';

export async function POST(request) {
  try {
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
    if (String(adminPin) !== String(correctPin)) {
      return NextResponse.json({ error: 'Nieprawidłowy PIN administratora' }, { status: 403 });
    }

    // Validate file
    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'Nie przesłano pliku' }, { status: 400 });
    }

    const filename = file.name || 'document.pdf';

    if (!filename.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json({ error: 'Dozwolone są tylko pliki PDF' }, { status: 400 });
    }

    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: 'Plik jest za duży (max 50MB)' }, { status: 400 });
    }

    // Convert File to ArrayBuffer then to Buffer for Vercel Blob
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Vercel Blob
    const blob = await put(`documents/${filename}`, buffer, {
      access: 'public',
      addRandomSuffix: true,
      contentType: 'application/pdf',
    });

    return NextResponse.json({
      ok: true,
      url: blob.url,
      filename: filename,
      size: file.size,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Błąd uploadu: ' + error.message }, { status: 500 });
  }
}
