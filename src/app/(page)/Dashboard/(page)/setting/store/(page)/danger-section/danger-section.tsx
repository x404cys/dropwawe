'use client';

import { useState } from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';
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
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />
          <h3 className="text-sm font-bold text-red-600">{t.store?.dangerZone}</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
          {t.store?.deleteWarning || 'هذه الإجراءات لا يمكن التراجع عنها. يرجى الحذر الشديد قبل المتابعة.'}
        </p>

        {confirmDelete ? (
          <div className="space-y-3">
            <div className="bg-card border border-red-200 rounded-lg p-3">
              <p className="text-xs font-semibold text-red-600 text-center">
                {t.store?.confirmDeleteStore?.replace('{name}', currentStore?.name || '') || `هل أنت متأكد من حذف متجر "${currentStore?.name}"؟`}
              </p>
              <p className="text-[11px] text-muted-foreground text-center mt-1">
                {t.store?.deleteStoreEffects || 'سيتم حذف جميع المنتجات والطلبات المرتبطة بهذا المتجر.'}
              </p>
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
                {loading ? (t.store?.deleting || 'جارٍ الحذف...') : (t.store?.yesDeleteStore || 'نعم، احذف المتجر')}
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
        ) : (
          <Button
            variant="outline"
            className="w-full text-red-600 hover:text-red-700 border-red-300 hover:bg-red-50 gap-2"
            onClick={() => setConfirmDelete(true)}
          >
            <Trash2 className="h-4 w-4" /> {t.store?.deleteStore}
          </Button>
        )}
      </div>
    </div>
  );
}
