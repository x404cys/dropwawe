import type { StorefrontProduct } from '../../../_lib/types';

interface ProductModalGalleryProps {
  images: StorefrontProduct['images'];
  fallbackImage: StorefrontProduct['image'];
  selectedIndex: number;
  onSelect: (index: number) => void;
  productName: string;
}

export default function ProductModalGallery({
  images,
  fallbackImage,
  selectedIndex,
  onSelect,
  productName,
}: ProductModalGalleryProps) {
  const hasGalleryImages = Boolean(images && images.length > 0);
  const galleryImages =
    hasGalleryImages && images
      ? images
      : fallbackImage
        ? [{ id: 'fallback', url: fallbackImage }]
        : [];
  const activeIndex = galleryImages[selectedIndex] ? selectedIndex : 0;
  const activeImage = galleryImages[activeIndex]?.url ?? fallbackImage;

  return (
    <div>
      <div className="overflow-hidden rounded-xl border">
        <div className="aspect-[4/5] w-full">
          {activeImage && (
            <img src={activeImage} alt={productName} className="h-full w-full object-cover" />
          )}
        </div>
      </div>

      {hasGalleryImages && images && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
          {images.map((image, index) => {
            const active = activeIndex === index;

            return (
              <button
                key={image.id}
                onClick={() => onSelect(index)}
                className={`overflow-hidden rounded-lg border-2 transition ${
                  active ? '' : 'border-transparent hover:border-black/10'
                }`}
                style={active ? { borderColor: 'var(--product-modal-primary)' } : undefined}
              >
                <div className="aspect-[4/5] w-16">
                  <img
                    src={image.url}
                    alt={`${productName} ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
