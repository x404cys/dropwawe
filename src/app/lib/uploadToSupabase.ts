import axios from 'axios';
import https from 'https';

export async function uploadToServer(file: File, userId: string) {
  try {
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '');
    const fileName = `${userId}-${Date.now()}-${cleanFileName}`;

    const formData = new FormData();
    formData.append('file', file, fileName);

    const agent = new https.Agent({
      rejectUnauthorized: false, // تجاهل التحقق من SSL
    });

    const response = await axios.post(
      'https://147.93.126.28:8080/uploads/uploads-sahl/',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        httpsAgent: agent,
      }
    );

    if (response.status === 200 && response.data?.url) {
      return response.data.url;
    }

    console.error('Upload failed:', response.data);
    return null;
  } catch (error) {
    console.error('Unexpected Upload Error:', error);
    return null;
  }
}
