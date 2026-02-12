import React from 'react';

const products = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1524594154908-edd3c8b4c1d4?q=80&w=800',
    name: 'اسم المنتج',
    price: '5,000',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800',
    name: 'اسم المنتج',
    price: '5,000',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1616627986440-8b6d3a8d1b3e?q=80&w=800',
    name: 'اسم المنتج',
    price: '5,000',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=800',
    name: 'اسم المنتج',
    price: '5,000',
  },
];

export default function RamadanStore() {
  return (
    <div dir="rtl" className="min-h-screen bg-[#7f2d2f] font-sans">
      {/* Header */}
      <div className="relative rounded-b-[40px] bg-[#f4efea] px-5 pt-8 pb-10 text-center">
        {/* Lanterns */}
        <div className="absolute top-4 left-5 flex gap-2 text-3xl">
          <span>🏮</span>
          <span>🏮</span>
          <span>🏮</span>
        </div>

        {/* Cart */}
        <div className="absolute top-5 right-5 rounded-lg border border-[#d9b3b4] p-2 text-xl">
          🧺
        </div>

        <h1 className="mt-6 text-3xl text-[#7f2d2f]">رمضان</h1>
        <h2 className="mt-2 text-[#7f2d2f]">مزهرياتي</h2>

        {/* Search */}
        <div className="relative mx-auto mt-6 max-w-sm">
          <input
            type="text"
            placeholder="ابحث عن منتج"
            className="w-full rounded-full border border-[#d9b3b4] bg-transparent py-3 pr-10 pl-4 outline-none"
          />
          <span className="absolute top-1/2 right-4 -translate-y-1/2">🔍</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex justify-around px-5 py-6">
        <button className="rounded-full border border-[#a45c5d] px-5 py-2 text-white">الكل</button>
        <button className="rounded-full border border-[#a45c5d] px-5 py-2 text-white">ملابس</button>
        <button className="rounded-full border border-[#a45c5d] px-5 py-2 text-white">
          ديكورات
        </button>
        <button className="rounded-full border border-[#a45c5d] px-5 py-2 text-white">
          المزيد
        </button>
      </div>

      {/* Products */}
      <div className="grid grid-cols-2 gap-5 px-5 pb-10">
        {products.map(product => (
          <div key={product.id} className="text-center text-white">
            <img src={product.image} alt="" className="h-[180px] w-full rounded-2xl object-cover" />
            <h3 className="mt-3 font-normal">{product.name}</h3>
            <p className="mt-1 text-lg">{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
