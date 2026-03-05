'use client';
import { useLanguage } from '../../context/LanguageContext';

import { useEffect, useState } from 'react';
import Toast from '@/components/Toast/Toast';
import { Product } from '@/types/Products';
import ProductTable from './_components/ProductTable';
 import { useUser } from '@/app/lib/context/UserIdContect';

export default function ProductManagementPage() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const { id } = useUser();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<
    Partial<Product> & { imageFile?: File; imagePreview?: string }
  >({});

  const [newProduct, setNewProduct] = useState<
    Partial<Product> & { imageFile?: File; imagePreview?: string }
  >({
    name: '',
    price: 0,
    quantity: 0,
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products/user/${id}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProducts(data);
    } catch {
      setToast({ type: 'error', message: t.inventory?.fetchFailed || 'فشل في جلب المنتجات' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (id: string) => {
    if (!confirm(t.inventory.confirmDelete)) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setToast({ type: 'success', message: t.inventory?.deleteSuccess || 'تم حذف المنتج بنجاح' });
      setProducts(products.filter(p => p.id !== id));
      if (editingId === id) {
        setEditingId(null);
        setEditData({});
      }
    } catch {
      setToast({ type: 'error', message: t.inventory?.deleteFailed || 'فشل في حذف المنتج' });
    }
  };

  const startEditing = (product: Product) => {
    setEditingId(product.id);
    setEditData({ ...product, imageFile: undefined, imagePreview: product.image });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditData({});
  };

  const saveEdit = async () => {
    if (!editingId) return;
    if (!editData.name || !editData.price || !editData.quantity) {
      setToast({ type: 'error', message: t.inventory?.fillAllFields || 'يرجى ملء جميع الحقول' });
      return;
    }
    try {
      const formData = new FormData();
      formData.append('name', editData.name);
      formData.append('price', editData.price.toString());
      formData.append('quantity', editData.quantity.toString());
      if (editData.imageFile) formData.append('image', editData.imageFile);

      const res = await fetch(`/api/products/${editingId}`, {
        method: 'PUT',
        body: formData,
      });

      if (!res.ok) throw new Error();

      const updated = await res.json();
      setProducts(products.map(p => (p.id === editingId ? updated : p)));
      setToast({ type: 'success', message: t.inventory?.updateSuccess || 'تم تحديث المنتج بنجاح' });
      cancelEditing();
    } catch {
      setToast({ type: 'error', message: t.inventory?.updateFailed || 'فشل في تحديث المنتج' });
    }
  };

  const addProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.quantity || !newProduct.imageFile) {
      setToast({ type: 'error', message: t.inventory?.fillAllAndImage || 'يرجى ملء جميع الحقول وتحميل صورة' });
      return;
    }
    try {
      const formData = new FormData();
      formData.append('name', newProduct.name);
      formData.append('price', newProduct.price.toString());
      formData.append('quantity', newProduct.quantity.toString());
      formData.append('image', newProduct.imageFile);

      const res = await fetch('/api/products', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error();

      const added = await res.json();
      setProducts([added, ...products]);
      setToast({ type: 'success', message: t.inventory?.addSuccess || 'تم إضافة المنتج بنجاح' });
      setNewProduct({
        name: '',
        price: 0,
        quantity: 0,
        imageFile: undefined,
        imagePreview: undefined,
      });
    } catch {
      setToast({ type: 'error', message: t.inventory?.addFailed || 'فشل في إضافة المنتج' });
    }
  };

  return (
    <div>
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <ProductTable />
    </div>
  );
}
