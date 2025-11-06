'use client';

import { Home, Book, DollarSign, ShoppingBag, User2 } from 'lucide-react';
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  window.location.href = '/OrderTrackingPage';
};
const handleSubmitHome = (e: React.FormEvent) => {
  e.preventDefault();

  window.location.href = '/Dashboard';
};
export default function FloatingNavBar() {
  return (
    <div className="fixed bottom-3  left-1/2 z-50 -translate-x-1/2 md:hidden lg:hidden">
      <div className="flex w-60 items-center justify-between rounded-2xl bg-[#ffffff] p-4 text-white shadow-xl">
        <button className="flex cursor-pointer flex-col items-center justify-center text-black opacity-80 transition hover:opacity-100">
          <Home size={20} onClick={handleSubmitHome} />
        </button>
        <button className="flex cursor-pointer flex-col items-center justify-center text-black opacity-80 transition hover:opacity-100">
          <ShoppingBag size={20} onClick={handleSubmit} />
        </button>
        <button className="flex cursor-pointer flex-col items-center justify-center text-black opacity-80 transition hover:opacity-100">
          <DollarSign size={20} />
        </button>
        <button className="flex cursor-pointer flex-col items-center justify-center text-black opacity-80 transition hover:opacity-100">
          <User2 size={20} />
        </button>
      </div>
    </div>
  );
}
