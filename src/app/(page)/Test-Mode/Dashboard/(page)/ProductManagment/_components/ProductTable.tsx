'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody } from '@/components/ui/table';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo, useState } from 'react';
import { useProducts } from '../_hooks/useProducts';
import Loader from '@/components/Loader';
import ProductRow from './ProductRow';
import ProductCard from './ProductCard';
import EditProductRow from './EditProductRow';
import { Product } from '@/types/Products';
import { toast } from 'sonner';
import { useDashboardData } from '../../../context/useDashboardData';
import { Boxes, ChevronDown, Package, Search, ShoppingBag, Truck } from 'lucide-react';
import { LuPackagePlus } from 'react-icons/lu';
import { useRouter } from 'next/navigation';
const FAKE_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'ساعة ذكية – إصدار رياضي',
    price: 950000,
    quantity: 12,
    description: 'ساعة ذكية مقاومة للماء مع تتبع النشاط والنبض',
    category: 'ساعات',
    shippingType: 'COURIER',
    hasReturnPolicy: 'لا يوجد',
    discount: 10,
    image: '/img-landing-page/9.png',
  },
  {
    id: 'p2',
    name: 'ساعة كلاسيك جلد',
    price: 780000,
    quantity: 8,
    description: 'ساعة أنالوك بتصميم كلاسيكي فاخر',
    category: 'ساعات',
    shippingType: 'COURIER',
    hasReturnPolicy: 'لا يوجد',
    discount: 10,
    image: '/img-landing-page/9.png',
  },
  {
    id: 'p3',
    name: 'حذاء رياضي رجالي',
    price: 1200000,
    quantity: 15,
    description: 'شوز رياضي مريح مناسب للجري والاستخدام اليومي',
    category: 'أحذية',
    shippingType: 'COURIER',
    hasReturnPolicy: 'لا يوجد',
    discount: 10,
    image: '/img-landing-page/10.png',
  },
  {
    id: 'p4',
    name: 'حذاء رياضي نسائي',
    price: 1100000,
    quantity: 10,
    description: 'تصميم خفيف مع دعم كامل للقدم',
    category: 'أحذية',
    shippingType: 'COURIER',
    hasReturnPolicy: 'لا يوجد',
    discount: 10,
    image: '/img-landing-page/10.png',
  },
];

export default function ProductTable() {
  const { data: session } = useSession();
  const { data } = useDashboardData(session?.user?.id);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<
    Partial<Product> & { imageFile?: File; imagePreview?: string }
  >({});
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const saveEdit = () => {};
  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      setProducts(FAKE_PRODUCTS);
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  const startEditing = (product: Product) => {
    setEditingId(product.id);
    setEditData({ ...product, imagePreview: product.image });
  };

  const closeEditDialog = () => {
    setShowEditDialog(false);
    setEditingId(null);
    setEditData({});
  };

  const categories = useMemo(() => {
    const cats = products.map(p => p.category);
    return Array.from(new Set(cats));
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter(p => p.name.toLowerCase().includes(search.toLowerCase().trim()))
      .filter(p => (categoryFilter ? p.category === categoryFilter : true));
  }, [products, search, categoryFilter]);

  return (
    <>
      <div className="my-3 block rounded-xl border bg-white px-4 py-3 transition-all duration-200 hover:shadow-md md:hidden">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-600">العدد الكلي للمنتجات</h3>
          <div className="flex h-8 w-8 items-center justify-center rounded border bg-gray-100">
            <Package className="h-5 w-5 text-gray-600" />
          </div>
        </div>
        <div className="mt-1 text-xl font-bold text-gray-900">{products.length}</div>
        <hr className="my-1" />

        <div
          dir="rtl"
          className="mt-4 flex items-center justify-between text-xs font-medium text-gray-600"
        >
          <button
            onClick={() => router.push('/Dashboard/ProductManagment/add-product')}
            className="flex flex-1 flex-col items-center gap-1 transition-colors hover:text-blue-600"
          >
            <LuPackagePlus className="h-5 w-5" />
            <span>إضافة منتج</span>
          </button>

          <div className="h-8 w-px bg-gray-200" />

          <button
            onClick={() => router.push('/Dashboard/ProductManagment')}
            className="flex flex-1 flex-col items-center gap-1 transition-colors hover:text-blue-600"
          >
            <Boxes className="h-5 w-5" />
            <span>المنتجات</span>
          </button>

          <div className="h-8 w-px bg-gray-200" />

          {session?.user?.role === 'SUPPLIER' ? (
            <button
              onClick={() => router.push('/Dashboard/OrderTrackingPage/SupplierOrderTrackingPage')}
              className="flex flex-1 flex-col items-center gap-1 transition-colors hover:text-blue-600"
            >
              <ShoppingBag className="h-5 w-5" />
              <span>الطلبات</span>
            </button>
          ) : (
            <button
              onClick={() => router.push('/Dashboard/supplier')}
              className="group relative flex flex-1 flex-col items-center gap-1 overflow-hidden transition-colors hover:text-blue-600"
            >
              <span className="absolute top-0 left-0 h-full w-1 -skew-x-12 bg-blue-600 opacity-0 transition-opacity group-hover:opacity-100" />

              <Truck className="h-5 w-5" />
              <span>الموردين</span>
            </button>
          )}
        </div>
      </div>

      <div dir="rtl" className="mb-4 flex w-full flex-col gap-3 md:flex-row">
        <div className="relative flex w-full md:w-[100%]">
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex h-full items-center justify-between rounded-r-lg border border-gray-200 px-4 text-sm font-medium transition-all hover:bg-gray-100 focus:border-blue-400 focus:ring-2 focus:ring-blue-300"
            >
              {categoryFilter || 'كل الأصناف'}
              <ChevronDown size={18} className="ml-1 text-gray-500" />
            </button>

            {open && (
              <div className="absolute right-0 z-10 mt-2 w-40 rounded-lg border bg-white">
                <ul className="max-h-60 overflow-auto p-1 text-sm">
                  <li
                    onClick={() => {
                      setCategoryFilter('');
                      setOpen(false);
                    }}
                    className="cursor-pointer rounded-md px-3 py-2 hover:bg-gray-100"
                  >
                    كل الأصناف
                  </li>
                  {categories.map(cat => (
                    <li
                      key={cat}
                      onClick={() => {
                        setCategoryFilter(cat);
                        setOpen(false);
                      }}
                      className="cursor-pointer rounded-md px-3 py-2 hover:bg-gray-100"
                    >
                      {cat}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="relative w-full flex-1">
            <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="ابحث عن منتج..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full rounded-l-lg border border-gray-200 p-3 font-medium transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-300"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <Loader />
        </div>
      ) : (
        <>
          <Card className="hidden md:block">
            <CardHeader>
              <CardTitle>قائمة المنتجات</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>المنتج</TableHead>
                    <TableHead>السعر</TableHead>
                    <TableHead>الكمية</TableHead>
                    <TableHead>الوصف</TableHead>
                    <TableHead>الصنف</TableHead>
                    <TableHead>التوصيل</TableHead>
                    <TableHead>سياسة الاسترجاع</TableHead>
                    <TableHead>الصورة</TableHead>
                    <TableHead>إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length === 0 ? (
                    <TableRow>
                      <td colSpan={9} className="py-6 text-center text-gray-500">
                        لا توجد منتجات (0)
                      </td>
                    </TableRow>
                  ) : (
                    filteredProducts.map(product => (
                      <ProductRow key={product.id} product={product} />
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div
            dir="rtl"
            className="mb-20 block max-h-[60vh] space-y-2 overflow-y-scroll rounded border md:hidden"
          >
            {filteredProducts.length === 0 ? (
              <p className="text-center text-gray-500">لا توجد منتجات (0)</p>
            ) : (
              filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={p => {
                    startEditing(p);
                    setShowEditDialog(true);
                  }}
                />
              ))
            )}
          </div>

          {showEditDialog && (
            <div
              dir="rtl"
              className="bg-opacity-40 absolute inset-0 z-50 flex items-center justify-center"
            >
              <div className="mx-auto w-full max-w-md rounded bg-white p-6 shadow-lg">
                <EditProductRow
                  editData={editData}
                  setEditData={setEditData}
                  onEditImageChange={e => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setEditData({
                      ...editData,
                      imageFile: file,
                      imagePreview: URL.createObjectURL(file),
                    });
                  }}
                  saveEdit={saveEdit}
                  cancelEditing={closeEditDialog}
                />
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
