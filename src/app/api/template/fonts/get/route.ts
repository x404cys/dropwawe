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

async function fileExists(filePath: string) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing font ID' }, { status: 400 });
    }

    const font = await prisma.templateCustomFont.findUnique({
      where: { id },
    });

    if (!font) {
      return NextResponse.json({ error: 'Font not found' }, { status: 404 });
    }

    let cleanPath = font.url;

    if (cleanPath.startsWith('http://') || cleanPath.startsWith('https://')) {
      cleanPath = new URL(cleanPath).pathname;
    }

    cleanPath = cleanPath.replace(/^\/+/, '');

    const cwd = process.cwd();

    const possiblePaths = [
      path.join(cwd, cleanPath),
      path.join(cwd, '..', cleanPath),
      path.join('/', cleanPath),
    ];

    console.log('Font URL:', font.url);
    console.log('process.cwd():', cwd);
    console.log('Trying paths:', possiblePaths);

    let resolvedPath: string | null = null;

    for (const p of possiblePaths) {
      if (await fileExists(p)) {
        resolvedPath = p;
        break;
      }
    }

    if (!resolvedPath) {
      return NextResponse.json(
        {
          error: 'Font file not found on disk',
          fontUrl: font.url,
          triedPaths: possiblePaths,
        },
        { status: 404 }
      );
    }

    console.log('Resolved font path:', resolvedPath);

    const fileBuffer = await fs.readFile(resolvedPath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': getContentType(font.url),
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error: any) {
    console.error('FONT API ERROR:', error);

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
