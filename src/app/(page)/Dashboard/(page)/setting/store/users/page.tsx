'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import CreateInviteButton from '../../../../_components/features/CreateInviteButton';
import { useLanguage } from '../../../../context/LanguageContext';

export default function UsersSettingsPage() {
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <section dir="rtl" className="*: min-h-screen pb-28">
      <div className="bg-card border-border sticky top-0 z-10 flex items-center gap-2 border-b px-4 py-3">
        <button
          onClick={() => router.back()}
          className="hover:bg-muted rounded-lg p-1.5 transition-colors"
        >
          <ArrowRight className="text-muted-foreground h-5 w-5" />
        </button>
        <h1 className="text-foreground text-base font-bold">
          {t.store?.team || 'إضافة مستخدم للمتجر'}
        </h1>
      </div>
      <div className="mx-auto flex max-w-xl flex-col items-center justify-center gap-6 px-4 pt-16">
        <CreateInviteButton />
      </div>
    </section>
  );
}
