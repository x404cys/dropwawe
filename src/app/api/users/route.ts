import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { prisma } from '../../lib/db';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const file = formData.get('image') as File;

    if (!email || !file) {
      return NextResponse.json({ error: 'Email and image are required' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(process.cwd(), 'public/uploads', fileName);
    await writeFile(filePath, buffer);

    const imagePath = `/uploads/${fileName}`;

    const user = await prisma.user.create({
      data: {
        name,
        email,
        image: imagePath,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (err) {
    console.error('Upload Error:', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
