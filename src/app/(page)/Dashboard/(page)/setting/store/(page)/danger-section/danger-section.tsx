'use client';

import { useState } from 'react';
import { Trash2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useStoreProvider } from '../../../../../context/StoreContext';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../../../../context/LanguageContext';

export default function DangerSection() {
  const { t } = useLanguage();
  const { currentStore } = useStoreProvider();
  const router = useRouter();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [storeNameInput, setStoreNameInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDeleteStore = async () => {
    if (!currentStore?.id) return;
    try { 
      setLoading(true);
      const res = await fetch(`/api/dashboard/store/delete-store`, { 
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ storeId: currentStore.id }),
      });
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
    <div className="mx-auto w-full max-w-xl space-y-5">
      <div>
        <h2 className="text-muted-foreground mb-3 px-1 text-xs font-semibold tracking-wide uppercase">
          {t.store?.dangerZone || 'منطقة الخطر'}
        </h2>

        {/* Warning banner */}
        <div className="bg-destructive/5 border-destructive/20 flex items-start gap-4 rounded-xl border p-4 shadow-sm">
          <div className="bg-destructive/10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl">
            <ShieldAlert className="text-destructive h-5 w-5" />
          </div>
          <div>
            <p className="text-destructive text-sm font-semibold">
              {t.store?.dangerZone || 'تحذير هام'}
            </p>
            <p className="text-destructive/80 mt-1.5 text-xs leading-relaxed">
              {t.store?.deleteWarning ||
                'هذه الإجراءات لا يمكن التراجع عنها. يرجى الحذر الشديد قبل المتابعة، حيث سيؤدي الحذف إلى إزالة كافة البيانات بشكل نهائي.'}
            </p>
          </div>
        </div>
      </div>

      {/* Delete store card */}
      <div className="bg-card border-border divide-border divide-y overflow-hidden rounded-xl border shadow-sm">
        <div className="flex items-center justify-between gap-4 px-4 py-4 transition-colors">
          <div className="flex items-center gap-3">
            <div className="bg-destructive/10 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg">
              <Trash2 className="text-destructive h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1 text-right">
              <p className="text-foreground text-sm font-medium">
                {t.store?.deleteStore || 'حذف المتجر'}
              </p>
              <p className="text-muted-foreground mt-0.5 text-[11px]">
                {t.store?.deleteStoreDesc || 'حذف دائم لا يمكن التراجع عنه'}
              </p>
            </div>
          </div>
          {!confirmDelete && (
            <Button
              variant="outline"
              size="sm"
              className="text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive h-9 flex-shrink-0 gap-2 px-4 font-medium"
              onClick={() => setConfirmDelete(true)}
            >
              <Trash2 className="h-3.5 w-3.5" />
              {t.store?.deleteStore || 'حذف'}
            </Button>
          )}
        </div>

        {confirmDelete && (
          <div className="bg-destructive/5 space-y-4 px-4 py-5">
            <div className="flex items-start gap-3">
              <div className="bg-destructive/20 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full">
                <AlertTriangle className="text-destructive h-4 w-4" />
              </div>
              <div>
                <p className="text-destructive text-sm font-semibold">
                  {t.store?.confirmDeleteStore?.replace('{name}', currentStore?.name || '') ||
                    `هل أنت متأكد من حذف المتجر "${currentStore?.name}"؟`}
                </p>
                <p className="text-destructive/80 mt-1.5 text-xs leading-relaxed">
                  {t.store?.deleteStoreEffects ||
                    'سيتم حذف جميع المنتجات والطلبات والعملاء المرتبطة بهذا المتجر نهائياً. لا يمكن التراجع عن هذه الخطوة.'}
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-destructive/90 block text-[11px] font-medium">
                اكتب{' '}
                <span className="bg-destructive/10 mr-1 rounded px-1 py-0.5 font-bold select-all">
                  "{currentStore?.name}"
                </span>{' '}
                لتأكيد الحذف
              </label>
              <Input
                value={storeNameInput}
                onChange={e => setStoreNameInput(e.target.value)}
                placeholder={currentStore?.name}
                dir="auto"
                className="border-destructive/30 focus-visible:ring-destructive/50 bg-background/50 h-9 text-sm"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="destructive"
                className="shadow-destructive/20 h-10 flex-1 gap-2 font-medium shadow-sm transition-all"
                disabled={loading || storeNameInput !== currentStore?.name}
                onClick={handleDeleteStore}
              >
                <Trash2 className="h-4 w-4" />
                {loading
                  ? t.store?.deleting || 'جارٍ الحذف...'
                  : t.store?.yesDeleteStore || 'نعم، احذف المتجر نهائياً'}
              </Button>
              <Button
                variant="outline"
                className="h-10 flex-[0.5] font-medium"
                onClick={() => {
                  setConfirmDelete(false);
                  setStoreNameInput('');
                }}
                disabled={loading}
              >
                {t.cancel || 'إلغاء'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
