// Purpose: 404 not-found page for the storefront — shown when subdomain is not found.

import { Package } from 'lucide-react';
import Link from 'next/link';

export default function StorefrontNotFound() {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <Package className="text-muted-foreground/20 mb-4 h-16 w-16" />
      <h1 className="text-foreground mb-2 text-xl font-bold">المتجر غير موجود</h1>
      <p className="text-muted-foreground mb-6 text-sm">تحقق من الرابط أو تواصل مع صاحب المتجر</p>
      <Link
        href="/"
        className="bg-card border-border text-foreground hover:bg-muted rounded-xl border px-6 py-2.5 text-sm font-medium transition-colors"
      >
        العودة للرئيسية
      </Link>
    </div>
  );
}
