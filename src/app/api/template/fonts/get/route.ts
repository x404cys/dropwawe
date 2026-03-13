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
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return new NextResponse('Missing font ID', { status: 400 });
    }

    const font = await prisma.templateCustomFont.findUnique({
      where: { id },
    });

    if (!font) {
      return new NextResponse('Font not found', { status: 406 });
    }

    const filePath = path.join(process.cwd(), font.url.replace(/^\//, ''));

    const fileBuffer = await fs.readFile(filePath);

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': getContentType(font.url),
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Font API error:', error);

    return new NextResponse('Internal Server Error', {
      status: 500,
    });
  }
}
