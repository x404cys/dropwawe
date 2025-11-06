'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { AiOutlineSend } from 'react-icons/ai';
import { useSession } from 'next-auth/react';
import CustomInput from '../../_components/InputStyle';
import { User, Phone, MessageSquare, Edit3 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
const problemTypes = ['مشكلة تقنية', 'اقتراح تطوير', 'استفسار عن الدفع', 'آخر'];

export default function SupportPage() {
  const session = useSession();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [type, setType] = useState(problemTypes[0]);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email: session.data?.user.email || '',
          phone,
          type,
          subject,
          message,
        }),
      });

      if (!res.ok) throw new Error('فشل إرسال الرسالة');

      toast.success('تم إرسال الرسالة بنجاح!');
      setName('');
      setPhone('');
      setType(problemTypes[0]);
      setSubject('');
      setMessage('');
    } catch (err) {
      console.error(err);
      toast.error('حدث خطأ أثناء إرسال الرسالة.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section dir="rtl" className="mb-20 flex min-h-screen flex-col items-center justify-center">
      <div className="relative flex w-full max-w-2xl items-start justify-start py-6">
        <div className="z-10 text-sm text-gray-950">
          مرحبًا <span className="font-semibold text-green-300">{session.data?.user.name}</span>👋🏻{' '}
          <br />
          يمكنك هنا مشاركة مشكلتك أو اقتراحك لتطوير المنصة. نحن دائمًا بالقرب منك للاستماع ومساعدتك.
        </div>
        <Image
          src="/IMG_3549.PNG"
          alt="illustration"
          width={150}
          height={150}
          className="absolute top-0 left-0 -z-10 opacity-30"
        />
      </div>

      <div className="mt-10 w-full max-w-2xl rounded-3xl bg-white/70 p-6 shadow-lg backdrop-blur-lg">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <CustomInput
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            placeholder="ادخل اسمك الكامل"
            label="الاسم"
            icon={<User className="h-4 w-4" />}
          />

          <CustomInput
            type="email"
            value={session.data?.user.email || ''}
            label="البريد الإلكتروني"
            icon={<Edit3 className="h-4 w-4" />}
          />

          <CustomInput
            required
            type="text"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="مثال: +9647701234567"
            label="رقم الهاتف / واتس / تلي"
            icon={<Phone className="h-4 w-4" />}
          />

          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700">نوع المشكلة</label>
            <select
              value={type}
              onChange={e => setType(e.target.value)}
              className="rounded-sm border border-gray-300 bg-gray-50 px-5 py-1.5 text-gray-800 transition-all focus:border-black focus:ring-2 focus:ring-black"
            >
              {problemTypes.map((item, idx) => (
                <option key={idx} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <CustomInput
            type="text"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            placeholder="مثال: مشكلة في تسجيل الدخول"
            label="موضوع الرسالة"
            icon={<Edit3 className="h-4 w-4" />}
          />
          <label className="text-sm font-medium text-gray-700">صف مشكلتك</label>
          <Textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            required
            rows={6}
            placeholder="اكتب رسالتك هنا..."
          />

          <button
            type="submit"
            disabled={loading}
            className="group relative flex w-full items-center justify-center gap-3 rounded-2xl bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <AiOutlineSend
              className={`transition-transform ${loading ? 'animate-spin' : 'group-hover:translate-x-1'}`}
            />
            {loading ? 'جاري الإرسال...' : 'إرسال الرسالة'}
          </button>
        </form>
      </div>
    </section>
  );
}
