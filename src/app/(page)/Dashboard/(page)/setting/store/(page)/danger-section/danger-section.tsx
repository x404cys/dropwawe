'use client';

import { useState } from 'react';
import { Trash2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useStoreProvider } from '../../../../../context/StoreContext';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../../../../context/LanguageContext';

export default function DangerSection() {
  const { t } = useLanguage();
  const { currentStore } = useStoreProvider();
  const router = useRouter();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDeleteStore = async () => {
    if (!currentStore?.id) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/stores/${currentStore.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      toast.success(t.store?.deleteSuccess || 'تم حذف المتجر بنجاح');
      router.push('/Dashboard');
    } catch {
      toast.error(t.store?.deleteError || 'فشل في حذف المتجر');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Warning banner */}
      <div className="flex items-start gap-3 rounded-xl bg-destructive/5 border border-destructive/20 p-4">
        <ShieldAlert className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-destructive">
            {t.store?.dangerZone || 'منطقة الخطر'}
          </p>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            {t.store?.deleteWarning || 'هذه الإجراءات لا يمكن التراجع عنها. يرجى الحذر الشديد قبل المتابعة.'}
          </p>
        </div>
      </div>

      {/* Delete store card */}
      <div className="rounded-xl border border-destructive/20 bg-card overflow-hidden">
        <div className="px-4 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10 flex-shrink-0">
              <Trash2 className="h-4 w-4 text-destructive" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {t.store?.deleteStore || 'حذف المتجر'}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {t.store?.deleteStoreDesc || 'حذف دائم لا يمكن التراجع عنه'}
              </p>
            </div>
          </div>
          {!confirmDelete && (
            <Button
              variant="outline"
              size="sm"
              className="text-destructive border-destructive/30 hover:bg-destructive/5 hover:text-destructive gap-1.5"
              onClick={() => setConfirmDelete(true)}
            >
              <Trash2 className="h-3.5 w-3.5" />
              {t.store?.deleteStore || 'حذف'}
            </Button>
          )}
        </div>

        {confirmDelete && (
          <div className="border-t border-destructive/20 bg-destructive/5 px-4 py-4 space-y-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-destructive">
                  {t.store?.confirmDeleteStore?.replace('{name}', currentStore?.name || '') ||
                    `هل أنت متأكد من حذف "${currentStore?.name}"؟`}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {t.store?.deleteStoreEffects || 'سيتم حذف جميع المنتجات والطلبات المرتبطة بهذا المتجر نهائياً.'}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="destructive"
                size="sm"
                className="flex-1 gap-1.5"
                disabled={loading}
                onClick={handleDeleteStore}
              >
                <Trash2 className="h-3.5 w-3.5" />
                {loading
                  ? t.store?.deleting || 'جارٍ الحذف...'
                  : t.store?.yesDeleteStore || 'نعم، احذف المتجر'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => setConfirmDelete(false)}
              >
                {t.cancel || 'تراجع'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
