"use client";

import { useState } from "react";
import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { ChevronDownIcon, LinkIcon, PhoneIcon, GlobeAltIcon } from "@heroicons/react/20/solid";

export default function CreateStoreForm() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    subLink: "",
    shippingPrice: "",
    shippingType: "",
    phone: "",
    facebookLink: "",
    instaLink: "",
    telegram: "",
    description: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/storev2/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      console.log("Store created:", data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white text-black">
      <div className="space-y-12 p-8">
        {/* معلومات المتجر */}
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold text-gray-900">معلومات المتجر</h2>
          <p className="mt-1 text-sm text-gray-600">أدخل بيانات المتجر الأساسية.</p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            {/* اسم المتجر */}
            <div className="sm:col-span-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-900">
                اسم المتجر
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="أدخل اسم المتجر"
                  className="block w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-gray-900 placeholder:text-gray-400 focus:outline-indigo-600 sm:text-sm"
                />
              </div>
            </div>

            {/* رابط المتجر */}
            <div className="sm:col-span-6">
              <label htmlFor="subLink" className="block text-sm font-medium text-gray-900">
                رابط المتجر
              </label>
              <div className="mt-2 flex rounded-md shadow-sm">
                <span className="flex select-none items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 text-sm">
                  myapp.com/
                </span>
                <input
                  type="text"
                  name="subLink"
                  id="subLink"
                  value={form.subLink}
                  onChange={handleChange}
                  placeholder="store-name"
                  className="block flex-1 rounded-none rounded-r-md border border-gray-300 bg-white px-3 py-1.5 text-gray-900 placeholder:text-gray-400 focus:outline-indigo-600 sm:text-sm"
                />
              </div>
            </div>

            {/* وصف المتجر */}
            <div className="col-span-full">
              <label htmlFor="description" className="block text-sm font-medium text-gray-900">
                وصف المتجر
              </label>
              <div className="mt-2">
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={form.description}
                  onChange={handleChange}
                  placeholder="اكتب وصفاً قصيراً عن متجرك..."
                  className="block w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-gray-900 placeholder:text-gray-400 focus:outline-indigo-600 sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* بيانات الشحن */}
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold text-gray-900">الشحن</h2>
          <p className="mt-1 text-sm text-gray-600">تفاصيل طرق وأسعار الشحن.</p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            {/* سعر الشحن */}
            <div className="sm:col-span-3">
              <label htmlFor="shippingPrice" className="block text-sm font-medium text-gray-900">
                سعر الشحن
              </label>
              <div className="mt-2">
                <input
                  id="shippingPrice"
                  name="shippingPrice"
                  type="number"
                  value={form.shippingPrice}
                  onChange={handleChange}
                  placeholder="مثال: 5"
                  className="block w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-gray-900 placeholder:text-gray-400 focus:outline-indigo-600 sm:text-sm"
                />
              </div>
            </div>

            {/* نوع الشحن */}
            <div className="sm:col-span-3">
              <label htmlFor="shippingType" className="block text-sm font-medium text-gray-900">
                نوع الشحن
              </label>
              <div className="mt-2">
                <select
                  id="shippingType"
                  name="shippingType"
                  value={form.shippingType}
                  onChange={handleChange}
                  className="block w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-gray-900 focus:outline-indigo-600 sm:text-sm"
                >
                  <option value="">اختر النوع</option>
                  <option value="normal">عادي</option>
                  <option value="express">سريع</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* وسائل التواصل */}
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold text-gray-900">وسائل التواصل</h2>
          <p className="mt-1 text-sm text-gray-600">أدخل بيانات التواصل الاجتماعي ورقم الهاتف.</p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            {/* الهاتف */}
            <div className="sm:col-span-3">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-900">
                رقم الهاتف
              </label>
              <div className="mt-2">
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+9647700000000"
                  className="block w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-gray-900 placeholder:text-gray-400 focus:outline-indigo-600 sm:text-sm"
                />
              </div>
            </div>

            {/* فيسبوك */}
            <div className="sm:col-span-3">
              <label htmlFor="facebookLink" className="block text-sm font-medium text-gray-900">
                رابط فيسبوك
              </label>
              <div className="mt-2">
                <input
                  id="facebookLink"
                  name="facebookLink"
                  type="text"
                  value={form.facebookLink}
                  onChange={handleChange}
                  placeholder="facebook.com/store"
                  className="block w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-gray-900 placeholder:text-gray-400 focus:outline-indigo-600 sm:text-sm"
                />
              </div>
            </div>

            {/* انستجرام */}
            <div className="sm:col-span-3">
              <label htmlFor="instaLink" className="block text-sm font-medium text-gray-900">
                رابط انستجرام
              </label>
              <div className="mt-2">
                <input
                  id="instaLink"
                  name="instaLink"
                  type="text"
                  value={form.instaLink}
                  onChange={handleChange}
                  placeholder="instagram.com/store"
                  className="block w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-gray-900 placeholder:text-gray-400 focus:outline-indigo-600 sm:text-sm"
                />
              </div>
            </div>

            {/* تليجرام */}
            <div className="sm:col-span-3">
              <label htmlFor="telegram" className="block text-sm font-medium text-gray-900">
                رابط تليجرام
              </label>
              <div className="mt-2">
                <input
                  id="telegram"
                  name="telegram"
                  type="text"
                  value={form.telegram}
                  onChange={handleChange}
                  placeholder="t.me/store"
                  className="block w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-gray-900 placeholder:text-gray-400 focus:outline-indigo-600 sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* الأزرار */}
      <div className="mt-6 flex items-center justify-end gap-x-6 px-8 pb-8">
        <button type="button" className="text-sm font-semibold text-gray-900">
          إلغاء
        </button>
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white shadow hover:bg-gray-800 focus:outline-indigo-600"
        >
          {loading ? "جاري الحفظ..." : "حفظ المتجر"}
        </button>
      </div>
    </form>
  );
}
