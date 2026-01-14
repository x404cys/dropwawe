'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';

interface StoreLinkCardProps {
  url: string;
  role?: string;
  UrlStore?: string;
}

export default function StoreLinkCard({ url, role, UrlStore }: StoreLinkCardProps) {
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!role || role === 'GUEST') {
    return null;
  }

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardContent className="space-y-3 p-5">
        <h3 className="text-lg font-semibold text-black">رابط متجرك</h3>
        <p className="text-sm text-gray-500">انسخه وشاركه مع العملاء</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input value={url} readOnly className="bg-gray-50 text-left" />
          <Button variant="outline" className="cursor-copy gap-2" onClick={copyToClipboard}>
            <Copy size={16} /> {copied ? 'تم النسخ' : 'نسخ'}
          </Button>
          <Button
            variant="default"
            onClick={() => {
              if (UrlStore?.trim()) router.push(UrlStore);
            }}
          >
            معاينة
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
