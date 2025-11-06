'use client';

type Props = {
  storeSlug: string;
};

export default function StorePageContent({ storeSlug }: Props) {
  return <p>المتجر: {storeSlug}</p>;
}
