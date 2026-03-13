import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOperation } from '@/app/lib/authOperation';
import { uploadToServer } from '@/app/lib/uploadToSupabase';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOperation);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('image') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const imageUrl = await uploadToServer(file, session.user.id);
    if (!imageUrl) {
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }

    return NextResponse.json({ url: imageUrl }, { status: 200 });
  } catch (error) {
    console.error('Upload Store Logo Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
