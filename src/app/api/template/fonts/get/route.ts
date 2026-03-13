import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { prisma } from '@/app/lib/db';

function getContentType(file: string) {
  const lower = file.toLowerCase();

  if (lower.endsWith('.woff2')) return 'font/woff2';
  if (lower.endsWith('.woff')) return 'font/woff';
  if (lower.endsWith('.ttf')) return 'font/ttf';
  if (lower.endsWith('.otf')) return 'font/otf';

  return 'application/octet-stream';
}

export async function GET(req: Request) {
  try {
    console.log('---- FONT REQUEST START ----');

    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    console.log('Request URL:', req.url);
    console.log('Font ID:', id);

    if (!id) {
      console.error('ERROR: Missing font ID');
      return NextResponse.json({ error: 'Missing font ID in query (?id=...)' }, { status: 400 });
    }

    const font = await prisma.templateCustomFont.findUnique({
      where: { id },
    });

    console.log('Font record from DB:', font);

    if (!font) {
      console.error('ERROR: Font not found in database for ID:', id);
      return NextResponse.json({ error: `Font not found for id: ${id}` }, { status: 404 });
    }

    if (!font.url) {
      console.error('ERROR: Font URL is empty in DB');
      return NextResponse.json({ error: 'Font URL is empty in database record' }, { status: 500 });
    }

    let cleanPath = font.url;

    // إذا كان الرابط كامل (https://...)
    if (cleanPath.startsWith('http://') || cleanPath.startsWith('https://')) {
      console.log('Detected full URL, extracting pathname');
      cleanPath = new URL(cleanPath).pathname;
    }

    cleanPath = cleanPath.replace(/^\//, '');

    const cwd = process.cwd();
    const filePath = path.join(cwd, cleanPath);

    console.log('process.cwd():', cwd);
    console.log('Font URL from DB:', font.url);
    console.log('Resolved file path:', filePath);

    let fileBuffer: Buffer;

    try {
      fileBuffer = await fs.readFile(filePath);
    } catch (fsError: any) {
      console.error('ERROR reading file:', fsError);
      return NextResponse.json(
        {
          error: 'Failed to read font file',
          filePath,
          message: fsError?.message,
        },
        { status: 500 }
      );
    }

    console.log('Font file loaded successfully');

    return new NextResponse(new Uint8Array(fileBuffer), {
      status: 200,
      headers: {
        'Content-Type': getContentType(font.url),
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error: any) {
    console.error('---- FONT API FATAL ERROR ----');
    console.error(error);

    return NextResponse.json(
      {
        error: 'Unexpected server error',
        message: error?.message,
        stack: error?.stack,
      },
      { status: 500 }
    );
  }
}
