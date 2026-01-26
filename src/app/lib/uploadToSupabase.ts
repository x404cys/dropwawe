import fs from 'fs';
import path from 'path';

export async function uploadToServer(file: File, userId: string) {
  try {
    const uploadsDir = path.join('/var/www/dropwave/uploads', userId);

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '');
    const fileName = `${Date.now()}-${cleanFileName}`;
    const filePath = path.join(uploadsDir, fileName);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    fs.writeFileSync(filePath, buffer);

    return `https://www.matager.store/uploads/${userId}/${fileName}`;
  } catch (err) {
    console.error('Upload Error:', err);
    return null;
  }
}
