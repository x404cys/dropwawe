'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Copy } from 'lucide-react';
import { useState } from 'react';

export default function OrderActions({ orderId }: { orderId: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="mb-4 flex items-center gap-8 justify-center">
      <Button
        variant={'outline'}
        onClick={handleCopy}
        className="flex items-center gap-1 text-sm font-medium"
      >
        <Copy className="h-4 w-4" />
        {copied ? 'تم النسخ!' : 'نسخ الرابط'}
      </Button>
      <Button
        variant={'outline'}
        onClick={() => window.history.back()}
        className="flex items-center gap-2 text-sm font-medium"
      >
        العودة
        <ArrowLeft className="h-4 w-4" />
      </Button>
    </div>
  );
}
