// Purpose: 404 not-found page for the storefront — shown when subdomain is not found.

import { Package } from 'lucide-react';
import Link from 'next/link';

export default function StorefrontNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center px-6">
      <Package className="h-16 w-16 text-muted-foreground/20 mb-4" />
      <h1 className="text-xl font-bold text-foreground mb-2">المتجر غير موجود</h1>
      <p className="text-sm text-muted-foreground mb-6">
        تحقق من الرابط أو تواصل مع صاحب المتجر
      </p>
      <Link
        href="/"
        className="px-6 py-2.5 rounded-xl bg-card border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
      >
        العودة للرئيسية
      </Link>
    </div>
  );
}
