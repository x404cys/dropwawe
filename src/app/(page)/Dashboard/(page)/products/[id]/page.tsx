'use client';

import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { type ReactNode, useEffect, useMemo, useState } from 'react';
import {
  BadgeInfo,
  Box,
  Loader2,
  MonitorSmartphone,
  Palette,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { BsBookmarksFill } from 'react-icons/bs';
import { CiBookmark } from 'react-icons/ci';
import { toast } from 'sonner';
import { useLanguage } from '../../../context/LanguageContext';
import { useFavorite } from '@/app/lib/context/FavContext';
import { formatIQD } from '@/app/lib/utils/CalculateDiscountedPrice';
import { Product } from '@/types/Products';

type ProductColorOption = NonNullable<Product['colors']>[number];

function normalizeValue(value?: string | null) {
  return value?.trim().toUpperCase() || '';
}

function getColorLabel(color: ProductColorOption) {
  return color.name ?? color.color ?? color.hex ?? '';
}

function getColorValue(color: ProductColorOption) {
  return color.hex ?? color.color ?? '';
}

function getDiscountedPrice(product: Product) {
  return product.discount && product.discount > 0
    ? product.price - (product.price * product.discount) / 100
    : product.price;
}

function getGalleryImages(product: Product | null) {
  if (!product) return [];

  const urls = [product.image, ...(product.images?.map(image => image.url) ?? [])].filter(
    (value): value is string => Boolean(value)
  );

  return Array.from(new Set(urls));
}

function findSelectedColor(colors: ProductColorOption[], selectedColor: string) {
  return colors.find(color =>
    [color.hex, color.color]
      .filter((value): value is string => Boolean(value))
      .some(value => normalizeValue(value) === normalizeValue(selectedColor))
  );
}

function InfoCard({ title, icon, value }: { title: string; icon: ReactNode; value: string }) {
  return (
    <div className="bg-card rounded-2xl border p-4">
      <div className="text-foreground mb-2 flex items-center gap-2 text-sm font-semibold">
        {icon}
        <span>{title}</span>
      </div>
      <p className="text-muted-foreground text-sm leading-6">{value}</p>
    </div>
  );
}

export default function ProductPage() {
  const { t, dir } = useLanguage();
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id || '';
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [qty, setQty] = useState(1);
  const [ownerId, setOwnerId] = useState('');

  const { addToFavoriteByKey, removeFromFavoriteByKey, isInFavoriteByKey } = useFavorite();

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error();

        const data: Product = await res.json();
        const gallery = getGalleryImages(data);

        setProduct(data);
        setSelectedImage(gallery[0] ?? null);
        setOwnerId(data.user?.id ?? data.userId ?? '');

        if ((data.sizes?.length ?? 0) === 1) {
          setSelectedSize(data.sizes?.[0]?.size ?? '');
        }

        if ((data.colors?.length ?? 0) === 1) {
          setSelectedColor(getColorValue(data.colors?.[0] as ProductColorOption));
        }
      } catch (error) {
        console.error(error);
        toast.error(t.inventory.fetchFailed);
      } finally {
        setLoading(false);
      }
    };

    void fetchProduct();
  }, [id, t.inventory.fetchFailed]);

  const galleryImages = useMemo(() => getGalleryImages(product), [product]);
  const finalPrice = product ? getDiscountedPrice(product) : 0;
  const sizeOptions = product?.sizes ?? [];
  const colorOptions = product?.colors ?? [];
  const selectedSizeOption = sizeOptions.find(
    size => normalizeValue(size.size) === normalizeValue(selectedSize)
  );
  const selectedColorOption = findSelectedColor(colorOptions, selectedColor);
  const productLinks = [
    { label: 'Telegram', href: product?.subInfo?.telegram },
    { label: 'Facebook', href: product?.subInfo?.facebookLink },
    { label: 'Instagram', href: product?.subInfo?.instaLink },
    { label: 'WhatsApp', href: product?.subInfo?.whatsapp ?? product?.subInfo?.whasapp },
    { label: 'Video', href: product?.subInfo?.videoLink },
  ].filter((link): link is { label: string; href: string } => Boolean(link.href));
  const maxVariantStock = Math.max(
    product?.quantity ?? 0,
    ...(sizeOptions.map(size => size.stock) ?? []),
    ...(colorOptions.map(color => color.stock) ?? [])
  );
  const availableStock = product?.unlimited
    ? null
    : (selectedSizeOption?.stock ?? selectedColorOption?.stock ?? maxVariantStock);
  const isOutOfStock = !product?.unlimited && (availableStock ?? 0) <= 0;
  const favoriteKey = ownerId ? `fav/${ownerId}` : '';
  const favoriteActive =
    product && favoriteKey ? isInFavoriteByKey(product.id, favoriteKey) : false;
  const shippingDetails =
    product?.subInfo?.shippingDetails ||
    product?.shippingType ||
    (product?.isDigital ? t.inventory.digitalProductNote : t.inventory.unavailable);
  const returnPolicy =
    product?.subInfo?.returnPolicy ||
    product?.hasReturnPolicy ||
    (product?.isDigital ? t.inventory.digitalProductNote : t.inventory.unavailable);

  const handleChangeQty = (delta: number) => {
    setQty(previous => {
      const nextValue = Math.max(previous + delta, 1);

      if (!product?.unlimited && availableStock !== null && availableStock !== undefined) {
        return Math.min(nextValue, Math.max(availableStock, 1));
      }

      return nextValue;
    });
  };

  useEffect(() => {
    if (product?.unlimited || availableStock === null || availableStock === undefined) {
      return;
    }

    setQty(previous => Math.min(previous, Math.max(availableStock, 1)));
  }, [availableStock, product?.unlimited]);

  const handleCreateOrder = async () => {
    if (!product) return;

    if (sizeOptions.length > 0 && !selectedSize) {
      toast.error(t.inventory.selectSizeFirst);
      return;
    }

    if (colorOptions.length > 0 && !selectedColor) {
      toast.error(t.inventory.selectColorFirst);
      return;
    }

    setCreatingOrder(true);

    try {
      const res = await fetch('/api/orders/self', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: qty,
          selectedColor: selectedColor || null,
          selectedSize: selectedSize || null,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || t.inventory.directOrderFailed);
      }

      toast.success(t.inventory.directOrderSuccess);
      router.push(`/Dashboard/orderDetails/${data.orderId}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t.inventory.directOrderFailed);
    } finally {
      setCreatingOrder(false);
    }
  };

  if (loading) {
    return (
      <section dir={dir} className="bg-background min-h-screen px-4 py-6 md:px-8">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="bg-muted aspect-[4/5] animate-pulse rounded-3xl" />
          <div className="space-y-4">
            <div className="bg-muted h-8 w-2/3 animate-pulse rounded-xl" />
            <div className="bg-muted h-6 w-1/3 animate-pulse rounded-xl" />
            <div className="bg-muted h-28 animate-pulse rounded-2xl" />
            <div className="grid gap-3 md:grid-cols-2">
              <div className="bg-muted h-24 animate-pulse rounded-2xl" />
              <div className="bg-muted h-24 animate-pulse rounded-2xl" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!product) {
    return <div className="p-8 text-center text-red-600">{t.inventory.fetchFailed}</div>;
  }

  return (
    <section dir={dir} className="bg-background min-h-screen px-4 py-6 md:px-8">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4">
          <div className="bg-card relative aspect-[4/5] overflow-hidden rounded-3xl border">
            {selectedImage ? (
              <Image
                src={selectedImage}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="text-muted-foreground flex h-full items-center justify-center">
                <Box className="h-12 w-12" />
              </div>
            )}

            {product.discount > 0 && (
              <span className="absolute top-4 left-4 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white">
                -{product.discount}%
              </span>
            )}
          </div>

          {galleryImages.length > 1 && (
            <div className="grid grid-cols-5 gap-3">
              {galleryImages.map(image => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setSelectedImage(image)}
                  className={`relative aspect-square overflow-hidden rounded-2xl border transition ${
                    selectedImage === image
                      ? 'border-primary ring-primary/20 ring-2'
                      : 'border-border'
                  }`}
                >
                  <Image src={image} alt={product.name} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-card rounded-3xl border p-6">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {product.category && (
                <span className="bg-muted text-muted-foreground rounded-full px-3 py-1 text-xs font-medium">
                  {product.category}
                </span>
              )}

              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  product.isDigital ? 'bg-sky-100 text-sky-700' : 'bg-amber-100 text-amber-700'
                }`}
              >
                {product.isDigital ? t.inventory.digitalProduct : t.inventory.physicalProduct}
              </span>

              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  isOutOfStock ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                {product.unlimited
                  ? t.inventory.unlimited
                  : isOutOfStock
                    ? t.inventory.outOfStock
                    : `${availableStock} ${t.inventory.pieces}`}
              </span>
            </div>

            <h1 className="text-foreground text-2xl font-bold md:text-3xl">{product.name}</h1>

            <div className="mt-4 flex items-end gap-3">
              <span className="text-primary text-2xl font-bold md:text-3xl">
                {formatIQD(finalPrice)} {t.currency}
              </span>
              {product.discount > 0 && (
                <span className="text-muted-foreground text-sm line-through">
                  {formatIQD(product.price)} {t.currency}
                </span>
              )}
            </div>

            <div className="bg-muted/40 mt-6 rounded-2xl p-4">
              <h2 className="text-foreground mb-2 text-sm font-semibold">
                {t.inventory.description}
              </h2>
              <p className="text-muted-foreground text-sm leading-7">
                {product.description || t.inventory.noDescriptionAvailable}
              </p>
            </div>

            {sizeOptions.length > 0 && (
              <div className="mt-6">
                <div className="text-foreground mb-3 flex items-center gap-2 text-sm font-semibold">
                  <BadgeInfo className="h-4 w-4" />
                  <span>{t.orders.size}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sizeOptions.map(size => (
                    <button
                      key={size.id}
                      type="button"
                      onClick={() => setSelectedSize(size.size)}
                      className={`rounded-2xl border px-4 py-2 text-sm transition ${
                        normalizeValue(selectedSize) === normalizeValue(size.size)
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-background text-foreground'
                      }`}
                    >
                      <span>{size.size}</span>
                      {!product.unlimited && (
                        <span className="mr-2 text-xs opacity-80">({size.stock})</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {colorOptions.length > 0 && (
              <div className="mt-6">
                <div className="text-foreground mb-3 flex items-center gap-2 text-sm font-semibold">
                  <Palette className="h-4 w-4" />
                  <span>{t.orders.color}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map(color => {
                    const colorValue = getColorValue(color);
                    const isActive = normalizeValue(selectedColor) === normalizeValue(colorValue);

                    return (
                      <button
                        key={color.id}
                        type="button"
                        onClick={() => setSelectedColor(colorValue)}
                        className={`flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm transition ${
                          isActive
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border bg-background text-foreground'
                        }`}
                      >
                        <span
                          className="h-4 w-4 rounded-full border"
                          style={{ backgroundColor: color.hex ?? color.color ?? '#d4d4d8' }}
                        />
                        <span>{getColorLabel(color)}</span>
                        {!product.unlimited && (
                          <span className="text-muted-foreground text-xs">({color.stock})</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="bg-background mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border p-4">
              <div>
                <p className="text-foreground text-sm font-semibold">{t.inventory.stock}</p>
                <p className="text-muted-foreground text-sm">
                  {product.unlimited
                    ? t.inventory.unlimited
                    : isOutOfStock
                      ? t.inventory.outOfStock
                      : `${availableStock} ${t.inventory.pieces}`}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleChangeQty(-1)}
                  className="bg-muted text-foreground hover:bg-muted/80 flex h-11 w-11 items-center justify-center rounded-2xl text-lg font-semibold transition"
                >
                  -
                </button>
                <span className="text-foreground min-w-10 text-center text-lg font-semibold">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => handleChangeQty(1)}
                  disabled={
                    !product.unlimited &&
                    availableStock !== null &&
                    qty >= Math.max(availableStock, 1)
                  }
                  className="bg-foreground text-background hover:bg-foreground/90 flex h-11 w-11 items-center justify-center rounded-2xl text-lg font-semibold transition disabled:cursor-not-allowed disabled:opacity-50"
                >
                  +
                </button>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleCreateOrder}
                disabled={creatingOrder || isOutOfStock}
                className="bg-foreground text-background hover:bg-foreground/90 flex flex-1 items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60"
              >
                {creatingOrder ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>{t.inventory.creatingDirectOrder}</span>
                  </>
                ) : (
                  <span>{t.inventory.createDirectOrder}</span>
                )}
              </button>

              <button
                type="button"
                onClick={() =>
                  favoriteActive
                    ? removeFromFavoriteByKey(product.id, favoriteKey)
                    : addToFavoriteByKey(
                        {
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          image: product.image,
                          quantity: product.quantity,
                          category: product.category,
                          discount: product.discount,
                          priceBeforeDiscount: product.priceBeforeDiscount,
                        },
                        favoriteKey
                      )
                }
                disabled={!favoriteKey}
                className="border-border text-foreground hover:bg-muted flex h-[52px] w-full items-center justify-center rounded-2xl border transition sm:w-[72px]"
              >
                {favoriteActive ? <BsBookmarksFill size={28} /> : <CiBookmark size={28} />}
              </button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <InfoCard
              title={product.isDigital ? t.inventory.digitalProduct : t.orders.shipping}
              icon={
                product.isDigital ? (
                  <MonitorSmartphone className="h-4 w-4 text-sky-600" />
                ) : (
                  <Truck className="h-4 w-4 text-emerald-600" />
                )
              }
              value={shippingDetails}
            />
            <InfoCard
              title={t.inventory.returnPolicy}
              icon={<ShieldCheck className="h-4 w-4 text-rose-600" />}
              value={returnPolicy}
            />
          </div>

          {productLinks.length > 0 && (
            <div className="bg-card rounded-3xl border p-6">
              <h2 className="text-foreground mb-4 text-sm font-semibold">
                {t.inventory.productLinks}
              </h2>
              <div className="flex flex-wrap gap-2">
                {productLinks.map(link => (
                  <a
                    key={`${link.label}-${link.href}`}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="border-border text-foreground hover:bg-muted rounded-full border px-4 py-2 text-sm transition"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
