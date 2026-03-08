'use client';
import { useLanguage } from '../../../context/LanguageContext';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody } from '@/components/ui/table';
import { useSession } from 'next-auth/react';
import React, { useEffect, useMemo, useState } from 'react';
import { useProducts } from '../_hooks/useProducts';
import Loader from '@/components/Loader';
import ProductRow from './ProductRow';
import ProductCard from './ProductCard';
import { Product } from '@/types/Products';
import { toast } from 'sonner';
import { useDashboardData } from '../../../context/useDashboardData';
import {
  AlertTriangle,
  BarChart3,
  Boxes,
  LayoutGrid,
  Package,
  Plus,
  Search,
  ShoppingBag,
  Tag,
  Truck,
  X,
} from 'lucide-react';
import { LuPackagePlus } from 'react-icons/lu';
import { useRouter } from 'next/navigation';
import { useStoreProvider } from '../../../context/StoreContext';
import { motion, AnimatePresence } from 'framer-motion';
import { formatIQD } from '@/app/lib/utils/CalculateDiscountedPrice';

export default function ProductTable() {
  const { t } = useLanguage();
  const { data: session } = useSession();
  const { data } = useDashboardData(session?.user?.id);
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();
  const [storeId, setStoreId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<
    Partial<Product> & { imageFile?: File; imagePreview?: string }
  >({});
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dismissedStockAlert, setDismissedStockAlert] = useState(false);
  const { currentStore } = useStoreProvider();
  const [loading, setLoading] = useState(false);
  const role = session?.user?.role;
  const isTraderOrSupplier = role === 'SUPPLIER' || role === 'TRADER';

  // ── Fetch products ────────────────────────────────────────────────────
  useEffect(() => {
    if (!currentStore?.id) return;
    setLoading(true);
    fetch(`/api/products/store/${currentStore.id}`)
      .then(res => {
        if (!res.ok) throw new Error(t.inventory?.fetchFailed || 'فشل في جلب المنتجات');
        return res.json();
      })
      .then(setProducts)
      .catch(err => console.error(err.message))
      .finally(() => setLoading(false));
  }, [currentStore?.id]);

  // ── Edit handlers ─────────────────────────────────────────────────────
  const startEditing = (product: Product) => {
    setEditingId(product.id);
    setEditData({ ...product, imagePreview: product.image });
  };

  const closeEditDialog = () => {
    setShowEditDialog(false);
    setEditingId(null);
    setEditData({});
  };

  const deleteProduct = async (id: string) => {
    if (!confirm(t.inventory.confirmDelete)) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setProducts(products.filter(p => p.id !== id));
    } catch {
      toast.error(t.inventory?.deleteFailed || 'فشل في حذف المنتج');
    }
  };

  const saveEdit = async () => {
    if (!editingId || !editData.name || !editData.price || !editData.quantity) {
      toast.error(t.inventory?.fillAllFields || 'يرجى ملء جميع الحقول');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('name', editData.name);
      formData.append('price', editData.price.toString());
      formData.append('quantity', editData.quantity.toString());
      if (editData.imageFile) formData.append('image', editData.imageFile);

      const res = await fetch(`/api/products/${editingId}`, { method: 'PUT', body: formData });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setProducts(products.map(p => (p.id === editingId ? updated : p)));
      closeEditDialog();
    } catch {
      toast.error(t.inventory?.updateFailed || 'فشل في تحديث المنتج');
    }
  };

  const categories = useMemo(() => {
    return Array.from(new Set(products.map(p => p.category).filter(Boolean)));
  }, [products]);

  const categoryCounts = useMemo(() => {
    return products.reduce<Record<string, number>>((acc, p) => {
      if (p.category) acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {});
  }, [products]);

  const lowStockProducts = useMemo(() => {
    return products.filter(
      p => !p.unlimited && p.quantity !== undefined && p.quantity < 5 && p.quantity > 0
    );
  }, [products]);

  const outOfStockProducts = useMemo(() => {
    return products.filter(p => !p.unlimited && p.quantity === 0);
  }, [products]);

  const totalValue = useMemo(() => {
    return products.reduce((sum, p) => sum + (p.price ?? 0), 0);
  }, [products]);

  const discountedCount = useMemo(() => {
    return products.filter(p => p.discount != null && p.discount > 0).length;
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter(p => p.name.toLowerCase().includes(search.toLowerCase().trim()))
      .filter(p => (categoryFilter ? p.category === categoryFilter : true));
  }, [products, search, categoryFilter]);

  const DesktopTable = (
    <Card className="border-border hidden rounded-2xl shadow-sm md:block">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between" dir="rtl">
          <CardTitle className="text-foreground text-base font-bold">
            {t.inventory?.products || 'قائمة المنتجات'} — {currentStore?.name}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t.inventory.product}</TableHead>
              <TableHead>{t.inventory.price}</TableHead>
              <TableHead>{t.inventory.quantity}</TableHead>
              <TableHead>{t.inventory.category}</TableHead>
              <TableHead>{t.store?.logo || 'الصورة'}</TableHead>
              <TableHead>{t.inventory?.actions || 'إجراءات'}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <td colSpan={9} className="py-12 text-center">
                  <div className="text-muted-foreground flex flex-col items-center gap-2">
                    <Package className="h-10 w-10 opacity-25" />
                    <p className="font-medium">{t.inventory.noProducts}</p>
                  </div>
                </td>
              </TableRow>
            ) : (
              filteredProducts.map(product => (
                <ProductRow
                  key={product.id}
                  product={product}
                  onEdit={startEditing}
                  onDelete={deleteProduct}
                />
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  return (
    <section dir="rtl" className="min-h-screen">
      <div className="space-y-4 p-4 pb-24">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-foreground text-lg font-bold">{'المخزن'}</h1>
            <p className="text-muted-foreground text-xs">
              {products.length} {t.inventory?.product || 'منتج'} — {currentStore?.name}
            </p>
          </div>
          {isTraderOrSupplier ? (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/Dashboard/ProductManagment/add-product')}
              className="bg-primary flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-bold text-white shadow-sm shadow-[#04BAF6]/30 transition-colors hover:bg-[#0288d1]"
            >
              <Plus className="h-4 w-4" /> {t.inventory.addProduct}{' '}
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/Dashboard/products-dropwave')}
              className="bg-primary flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-bold text-white shadow-sm shadow-[#04BAF6]/30 transition-colors hover:bg-[#0288d1]"
            >
              <LuPackagePlus className="h-4 w-4" />
              {t.home?.dashboard || 'المخزن'}
            </motion.button>
          )}
        </div>

        {products.length > 0 && (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              {
                label: t.inventory.products,
                value: products.length,
                icon: Package,
                color: 'text-[#04BAF6]',
                bg: 'bg-[#04BAF6]/10',
              },
              {
                label: t.inventory.categories,
                value: Object.keys(categoryCounts).length || 0,
                icon: LayoutGrid,
                color: 'text-purple-600',
                bg: 'bg-purple-50',
              },
              {
                label: t.stats?.totalRevenue || 'إجمالي الأسعار',
                value: `${formatIQD(totalValue)} ${t.currency || 'د.ع'}`,
                icon: BarChart3,
                color: 'text-green-600',
                bg: 'bg-green-50',
                small: false,
              },
              {
                label: t.inventory?.outOfStock || 'نفاد المخزون',
                value: outOfStockProducts.length,
                icon: Tag,
                color: 'text-red-500',
                bg: 'bg-red-50',
              },
            ].map(stat => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-card border-border rounded-xl border p-2">
                  <div
                    className={`mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg`}
                  >
                    <Icon className={`h-4 w-4`} />
                  </div>
                  <div className={`text-foreground font-bold ${stat.small ? '' : 'text-xl'}`}>
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground mt-0.5 text-[11px]">{stat.label}</div>
                </div>
              );
            })}
          </div>
        )}

        <AnimatePresence>
          {lowStockProducts.length > 0 && !dismissedStockAlert && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3"
            >
              <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-500" />
              <div className="min-w-0 flex-1">
                <p className="text-muted-foreground dark:text-muted font-bold font-semibold">
                  {t.inventory?.lowStock || 'منتجات قاربت على النفاد'}
                </p>
                <p className="text-muted-foreground dark:text-muted font-bold font-light">
                  {lowStockProducts.map(p => `${p.name} (${p.quantity})`).join('، ')}
                </p>
              </div>
              <button
                onClick={() => setDismissedStockAlert(true)}
                className="flex-shrink-0 rounded-full p-1 transition-colors hover:bg-amber-100"
              >
                <X className="h-4 w-4 text-amber-500" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t.inventory.searchPlaceholder}
            className="border-border bg-card w-full rounded-xl border py-2.5 pr-10 pl-4 transition outline-none focus:border-[#04BAF6] focus:ring-2 focus:ring-[#04BAF6]/20"
          />
        </div>

        {categories.length > 0 && (
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setCategoryFilter('')}
              className={`flex-shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                categoryFilter === ''
                  ? 'bg-primary text-white shadow-sm shadow-[#04BAF6]/30'
                  : 'bg-card border-border text-muted-foreground border hover:border-[#04BAF6]/50'
              }`}
            >
              {t.all || 'الكل'} ({products.length})
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`flex-shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                  categoryFilter === cat
                    ? 'bg-[#04BAF6] text-white shadow-sm shadow-[#04BAF6]/30'
                    : 'bg-card border-border text-muted-foreground border hover:border-[#04BAF6]/50'
                }`}
              >
                {cat} ({categoryCounts[cat] ?? 0})
              </button>
            ))}
          </div>
        )}

        {data?.Stores && data.Stores.length > 1 && (
          <select
            dir="rtl"
            className="border-border bg-card w-full rounded-xl border p-3 md:hidden"
            onChange={e => setStoreId(e.target.value)}
          >
            {data.Stores.map(store => (
              <option key={store.id} value={store.id}>
                {store.name}
              </option>
            ))}
          </select>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader />
          </div>
        ) : (
          <>
            {DesktopTable}

            <div className="block md:hidden">
              {filteredProducts.length === 0 ? (
                <div className="text-muted-foreground flex flex-col items-center justify-center py-20">
                  <Package className="mb-3 h-14 w-14 opacity-25" />
                  <p className="font-semibold">
                    {products.length === 0
                      ? t.inventory.noProducts
                      : t.noResults || 'لا يوجد نتائج'}
                  </p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    {products.length === 0
                      ? t.inventory?.pressToStart || 'اضغط على إضافة منتج للبدء'
                      : t.inventory?.changeCategoryOrSearch || 'جرب كلمة بحث أخرى أو غيّر الصنف'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2.5">
                  {filteredProducts.map((product, i) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.25 }}
                    >
                      <ProductCard
                        product={product}
                        onEdit={p => {
                          startEditing(p);
                          setShowEditDialog(true);
                        }}
                        onDelete={deleteProduct}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
