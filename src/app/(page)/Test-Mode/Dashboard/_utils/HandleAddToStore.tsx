'use client';

import { useEffect, useState } from 'react';
import { X, Plus, TrendingUp } from 'lucide-react';
import CategoryDropdown from '../(page)/ProductManagment/_components/InputForCatogery';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import axios from 'axios';

export default function HandleAddToStore({ productId }: { productId: string }) {
  const session = useSession();
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [profit, setProfit] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`/api/products/categories/${session.data?.user.id}`);
        if (!res.ok) throw new Error('Failed to fetch categories');
        const data: string[] = await res.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [session.data?.user.id]);

  const handleSubmit = () => {
    if (!profit || !selectedCategory) {
      toast.error('الرجاء ادخال السعر واختيار التصنيف');
      return;
    }
    axios.post(`/api/products/add-product-to-store`, {
      productId: productId,
      profit,
      category: selectedCategory,
    });
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group bg-foreground text-background hover:bg-foreground/90 inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-center text-sm font-medium shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
      >
        <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
        اضف المنتج الى متجرك
      </button>

      {open && (
        <div
          className="animate-in fade-in fixed inset-0 z-[999] flex items-center justify-center transition-all duration-300"
          onClick={() => setOpen(false)}
        >
          <div
            className="animate-in zoom-in-95 slide-in-from-bottom-4 relative mx-4 w-full max-w-md duration-300"
            onClick={e => e.stopPropagation()}
          >
            <div className="border-border bg-card overflow-hidden rounded-2xl border shadow-2xl">
              <div className="border-border bg-muted/30 relative flex items-center justify-between border-b px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                    <TrendingUp className="text-primary h-5 w-5" />
                  </div>
                  <h3 className="text-foreground text-lg font-semibold">اضف المنتج إلى موقعك</h3>
                </div>
                <button
                  className="text-muted-foreground hover:bg-muted hover:text-foreground flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
                  onClick={() => setOpen(false)}
                  aria-label="إغلاق"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6 p-6" dir="rtl">
                <div className="space-y-2">
                  <label className="text-foreground text-sm font-medium">
                    حدد الربح الذي تريد إضافته على المنتج
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="اكتب سعرك"
                      value={profit}
                      onChange={e => setProfit(e.target.value)}
                      className="border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 w-full rounded-lg border px-4 py-3 text-sm transition-colors focus:ring-2 focus:outline-none"
                    />
                  </div>
                  <p className="text-destructive flex items-start gap-1.5 text-xs">
                    <span className="mt-0.5">⚠</span>
                    <span>الربح يجب أن لا يتجاوز الحد الأدنى أو ضعفه.</span>
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-foreground text-sm font-medium">اختر التصنيف</label>
                  <CategoryDropdown
                    categories={categories}
                    value={selectedCategory}
                    onChange={val => setSelectedCategory(val)}
                    loading={false}
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-lg px-4 py-3 text-sm font-medium shadow-sm transition-all hover:shadow-md active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
                >
                  اضف المنتج
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
