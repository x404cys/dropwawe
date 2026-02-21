'use client';

import type React from 'react';
import { useState, type ChangeEvent, useEffect } from 'react';
import { toast } from 'sonner';
import imageCompression from 'browser-image-compression';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/app/lib/context/UserIdContect';
import { useDashboardData } from '../../../context/useDashboardData';
import type { Product } from '@/types/Products';
import { BasicInfoSection } from './_components/BasicInfoSection';
import { PricingDetailsSection } from './_components/PricingDetailsSection';
import { StockSection } from './_components/StockSection';
import { DescriptionSection } from './_components/DescriptionSection';
import { SizesSection } from './_components/SizesSection';
import { ColorsSection } from './_components/ColorsSection';
import { ShippingSection } from './_components/ShippingSection';
import { SocialMediaSection } from './_components/SocialMediaSection';
import { MainImageSection } from './_components/MainImageSection';
import { GallerySection } from './_components/GallerySection';
import { SubmitButton } from './_components/SubmitButton';
import { useStoreProvider } from '../../../context/StoreContext';

export default function ProductAddPage() {
  const { data: session } = useSession();
  const { data } = useDashboardData(session?.user?.id);
  const router = useRouter();
  const { currentStore } = useStoreProvider();

  const [expandedSections, setExpandedSections] = useState({
    sizes: false,
    colors: false,
    socialMedia: false,
    shipping: false,
    gallery: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const [newProduct, setNewProduct] = useState<
    Partial<Product> & {
      imageFile?: File;
      imagePreview?: string;
      unlimited: boolean;
    }
  >({
    name: '',
    price: 0,
    quantity: 0,
    discount: 0,
    category: '',
    description: '',
    hasReturnPolicy: '',
    shippingType: '',
    unlimited: false,
  });

  const { id } = useUser();
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [sizes, setSizes] = useState<{ size: string; stock: number }[]>([]);
  const [colors, setColors] = useState<{ name: string; hex: string; stock: number }[]>([]);
  const [storeId, setStoreId] = useState<string>('');
  const [compressionProgress, setCompressionProgress] = useState(0);
  const [isCompressing, setIsCompressing] = useState(false);
  useEffect(() => {
    if (!id) return;

    async function fetchCategories() {
      try {
        const res = await fetch(`/api/products/categories/${id}`);
        if (!res.ok) throw new Error('Failed to fetch categories');
        const data: string[] = await res.json();
        setCategories(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchCategories();
  }, [id]);

  const onGalleryChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;

    const remaining = 3 - galleryFiles.length;
    if (remaining <= 0) {
      toast.error('يمكنك رفع 3 صور إضافية فقط');
      return;
    }

    const filesToAdd = files.slice(0, remaining);

    setGalleryFiles(prev => [...prev, ...filesToAdd]);
    setGalleryPreviews(prev => [...prev, ...filesToAdd.map(f => URL.createObjectURL(f))]);
  };

  const removeGalleryImage = (index: number) => {
    setGalleryFiles(prev => prev.filter((_, i) => i !== index));
    setGalleryPreviews(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      toast.warning('لم يتم اختيار أي صورة');
      return;
    }

    if (file.size === 0) {
      toast.warning('الملف تالف أو فارغ');
      e.target.value = '';
      return;
    }

    const MAX_UPLOAD_MB = 15;
    if (file.size > MAX_UPLOAD_MB * 1024 * 1024) {
      toast.warning(`حجم الصورة كبير جداً. الحد الأقصى ${MAX_UPLOAD_MB}MB`);
      e.target.value = '';
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.warning('صيغة الصورة غير مدعومة (JPG / PNG / WEBP فقط)');
      e.target.value = '';
      return;
    }

    try {
      setIsCompressing(true);
      setCompressionProgress(0);

      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        onProgress: progress => {
          setCompressionProgress(progress);
        },
      });

      const preview = URL.createObjectURL(compressedFile);

      setNewProduct(prev => ({
        ...prev,
        imageFile: compressedFile,
        imagePreview: preview,
      }));
    } catch (err) {
      console.error('Compression error:', err);
      toast.warning('فشل تجهيز الصورة');
    } finally {
      setIsCompressing(false);
    }
  };

  const updateSize = (index: number, field: 'size' | 'stock', value: string | number) => {
    const updated = [...sizes];
    if (field === 'size') {
      updated[index].size = String(value);
    } else if (field === 'stock') {
      const numeric = Number(value);
      updated[index].stock = isNaN(numeric) ? 0 : numeric;
    }
    setSizes(updated);
  };

  const addSize = () => {
    setSizes([...sizes, { size: '', stock: 0 }]);
  };

  const removeSize = (index: number) => {
    setSizes(sizes.filter((_, idx) => idx !== index));
  };

  const updateColor = (index: number, field: 'name' | 'hex' | 'stock', value: string | number) => {
    const updated = [...colors];
    if (field === 'name') updated[index].name = String(value);
    else if (field === 'hex') updated[index].hex = String(value);
    else if (field === 'stock') updated[index].stock = Number(value);
    setColors(updated);
  };

  const addColor = () => setColors([...colors, { name: '', hex: '#000000', stock: 0 }]);

  const removeColor = (index: number) => setColors(colors.filter((_, i) => i !== index));

  const addProduct = async () => {
    if (
      !newProduct.name?.trim() ||
      !newProduct.price ||
      (!newProduct.unlimited && newProduct.quantity == null) ||
      !newProduct.imageFile ||
      !newProduct.description?.trim() ||
      !newProduct.category?.trim()
    ) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append('name', newProduct.name.trim());
      formData.append('price', String(newProduct.price));
      formData.append('quantity', newProduct.unlimited ? '0' : String(newProduct.quantity));
      formData.append('description', newProduct.description.trim());
      formData.append('category', newProduct.category);
      formData.append('image', newProduct.imageFile);

      formData.append('unlimited', newProduct.unlimited ? 'true' : 'false');
      formData.append(
        'discount',
        Number.isFinite(newProduct.discount) ? String(newProduct.discount) : '0'
      );

      formData.append('storeId', currentStore?.id || '');

      if (newProduct.shippingType?.trim()) {
        formData.append('shippingType', newProduct.shippingType.trim());
      }

      if (newProduct.hasReturnPolicy?.trim()) {
        formData.append('hasReturnPolicy', newProduct.hasReturnPolicy.trim());
      }

      if (sizes.length > 0) {
        formData.append('sizes', JSON.stringify(sizes));
      }

      if (colors.length > 0) {
        formData.append('colors', JSON.stringify(colors));
      }

      if (newProduct.pricingDetails) {
        const { minPrice, maxPrice, wholesalePrice } = newProduct.pricingDetails;

        if (Number.isFinite(minPrice)) {
          formData.append('minPrice', String(minPrice));
        }

        if (Number.isFinite(maxPrice)) {
          formData.append('maxPrice', String(maxPrice));
        }

        if (Number.isFinite(wholesalePrice)) {
          formData.append('wholesalePrice', String(wholesalePrice));
        }
      }

      if (newProduct.subInfo?.telegram?.trim()) {
        formData.append('telegramLink', newProduct.subInfo.telegram.trim());
      }

      if (newProduct.subInfo?.facebookLink?.trim()) {
        formData.append('facebookLink', newProduct.subInfo.facebookLink.trim());
      }

      if (newProduct.subInfo?.instaLink?.trim()) {
        formData.append('instaLink', newProduct.subInfo.instaLink.trim());
      }

      if (newProduct.subInfo?.whasapp?.trim()) {
        formData.append('whasapp', newProduct.subInfo.whasapp.trim());
      }

      if (newProduct.subInfo?.videoLink?.trim()) {
        formData.append('videoLink', newProduct.subInfo.videoLink.trim());
      }

      galleryFiles.forEach(file => {
        formData.append('gallery', file);
      });

      const res = await fetch('/api/products', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('FAILED');
      }

      toast.success('تم إضافة المنتج بنجاح');
      router.push('/Dashboard/ProductManagment');
      setNewProduct({
        name: '',
        price: 0,
        quantity: 0,
        discount: 0,
        category: '',
        description: '',
        imageFile: undefined,
        imagePreview: undefined,
        shippingType: '',
        hasReturnPolicy: '',
        unlimited: false,
      });

      setGalleryFiles([]);
      setGalleryPreviews([]);
      setSizes([]);
      setColors([]);
    } catch (error) {
      console.error(error);
      toast.error('فشل في إضافة المنتج');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-20 min-h-screen bg-white" dir="rtl">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <BasicInfoSection
              newProduct={newProduct}
              setNewProduct={setNewProduct}
              loading={loading}
            />

            {data.supplier && (
              <PricingDetailsSection
                newProduct={newProduct}
                setNewProduct={setNewProduct}
                loading={loading}
              />
            )}

            <StockSection
              newProduct={newProduct}
              setNewProduct={setNewProduct}
              loading={loading}
              categories={categories}
              storeId={currentStore?.id as string}
              setStoreId={setStoreId}
              data={data}
            />

            <DescriptionSection
              newProduct={newProduct}
              setNewProduct={setNewProduct}
              loading={loading}
            />

            <SizesSection
              sizes={sizes}
              updateSize={updateSize}
              addSize={addSize}
              removeSize={removeSize}
              isExpanded={expandedSections.sizes}
              onToggle={() => toggleSection('sizes')}
            />

            <ColorsSection
              colors={colors}
              updateColor={updateColor}
              addColor={addColor}
              removeColor={removeColor}
              isExpanded={expandedSections.colors}
              onToggle={() => toggleSection('colors')}
            />

            <ShippingSection
              newProduct={newProduct}
              setNewProduct={setNewProduct}
              loading={loading}
              isExpanded={expandedSections.shipping}
              onToggle={() => toggleSection('shipping')}
            />

            {data.supplier && (
              <SocialMediaSection
                newProduct={newProduct}
                setNewProduct={setNewProduct}
                loading={loading}
                isExpanded={expandedSections.socialMedia}
                onToggle={() => toggleSection('socialMedia')}
              />
            )}
          </div>

          <div className="space-y-6 rounded-lg">
            <MainImageSection
              newProduct={newProduct}
              setNewProduct={setNewProduct}
              handleImageChange={handleImageChange}
              loading={loading}
              isCompressing={isCompressing}
              compressionProgress={compressionProgress}
            />

            <GallerySection
              galleryFiles={galleryFiles}
              galleryPreviews={galleryPreviews}
              onGalleryChange={onGalleryChange}
              removeGalleryImage={removeGalleryImage}
              isExpanded={expandedSections.gallery}
              onToggle={() => toggleSection('gallery')}
              loading={loading}
            />

            <SubmitButton loading={loading} onClick={addProduct} />
          </div>
        </div>
      </div>
    </div>
  );
}
