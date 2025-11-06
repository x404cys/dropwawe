import SupportEmail from '@/components/emails/SupportEmail';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, message, type, phone, subject } = await req.json();

    const data = await resend.emails.send({
      from: 'Support <support@sahlapp.io>',
      to: '0xabdulrahmanmanaf@gmail.com',
      subject: `رسالة دعم من ${name}`,
      react: SupportEmail({ name, email, message, type, phone, subject }),
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
