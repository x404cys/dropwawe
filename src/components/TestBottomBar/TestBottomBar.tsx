"use client";

import { LayoutDashboard, Users, ShoppingCart, Settings } from "lucide-react";

export default function TestBottomBar() {
  return (
    <div className="min-h-screen bg-gray-100 pb-32 p-6">
      <h1 className="text-3xl font-bold mb-6">صفحة اختبار</h1>
      <p>هذا محتوى تجريبي للتأكد من ظهور شريط التنقل السفلي.</p>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 z-50 w-full bg-black text-white border-t border-gray-800">
        <div className="flex items-center justify-around px-4 py-2">
          {[
            { icon: <LayoutDashboard size={22} />, label: "الرئيسية" },
            { icon: <Users size={22} />, label: "المستخدمين" },
            { icon: <ShoppingCart size={22} />, label: "الطلبات" },
            { icon: <Settings size={22} />, label: "الإعدادات" },
          ].map(({ icon, label }, index) => (
            <button
              key={index}
              className="flex flex-col items-center gap-1 text-xs transition hover:text-green-400"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-800 transition">
                {icon}
              </div>
              <span className="text-[11px]">{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
