import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { prisma } from '@/app/lib/db';

const ALLOWED_EXTENSIONS = new Set(['.woff', '.woff2', '.ttf', '.otf']);

const FONTS_BASE_DIR = path.resolve(process.cwd(), 'public', 'fonts');

function getContentType(file: string): string {
  const lower = file.toLowerCase();
  if (lower.endsWith('.woff2')) return 'font/woff2';
  if (lower.endsWith('.woff')) return 'font/woff';
  if (lower.endsWith('.ttf')) return 'font/ttf';
  if (lower.endsWith('.otf')) return 'font/otf';
  return 'application/octet-stream';
}

function isValidFontId(id: string): boolean {
  return /^[a-zA-Z0-9_-]{1,128}$/.test(id);
}

async function safeReadFont(fontUrl: string): Promise<Buffer> {
  let filename = path.basename(fontUrl);

  const ext = path.extname(filename).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    throw new Error('INVALID_EXTENSION');
  }

  const resolvedPath = path.resolve(FONTS_BASE_DIR, filename);

  if (!resolvedPath.startsWith(FONTS_BASE_DIR + path.sep)) {
    throw new Error('PATH_TRAVERSAL_DETECTED');
  }

  try {
    return await fs.readFile(resolvedPath);
  } catch {
    throw new Error('FILE_NOT_FOUND');
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id || !isValidFontId(id)) {
      return NextResponse.json({ error: 'Invalid font ID' }, { status: 400 });
    }

    const font = await prisma.templateCustomFont.findUnique({
      where: { id },
      select: { id: true, url: true },
    });

    if (!font) {
      return NextResponse.json({ error: 'Font not found' }, { status: 404 });
    }

    let fileBuffer: Buffer;
    try {
      fileBuffer = await safeReadFont(font.url);
    } catch (err: any) {
      if (err.message === 'INVALID_EXTENSION') {
        return NextResponse.json({ error: 'Invalid file type' }, { status: 403 });
      }
      if (err.message === 'PATH_TRAVERSAL_DETECTED') {
        console.error(`[SECURITY] Path traversal attempt blocked. Font ID: ${id}`);
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }
      return NextResponse.json({ error: 'Font file not found' }, { status: 404 });
    }

    return new NextResponse(new Uint8Array(fileBuffer), {
      status: 200,
      headers: {
        'Content-Type': getContentType(font.url),
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('[FONT API ERROR]', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
