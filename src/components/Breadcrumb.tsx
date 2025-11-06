'use client';

import { Home } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) {
    return null;
  }

  const idRegex = /^[a-z0-9-]{20,}$/i;

  const paths = segments
    .filter(seg => !idRegex.test(seg))
    .map((seg, i, arr) => ({
      name: decodeURIComponent(seg),
      href: '/' + arr.slice(0, i + 1).join('/'),
    }));

  return (
    <nav dir="rtl" className="flex items-center px-2 py-2 text-sm font-medium text-gray-600">
      <Link href="/" className="transition hover:text-green-600">
        <Home />
      </Link>

      {paths.map((p, i) => (
        <div key={i} className="flex items-center">
          <span className="mx-2 text-gray-400">/</span>
          {i === paths.length - 1 ? (
            <span className="font-semibold text-gray-900">{p.name}</span>
          ) : (
            <Link href={p.href} className="capitalize transition hover:text-green-600">
              {p.name}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
