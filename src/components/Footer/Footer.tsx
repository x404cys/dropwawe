'use client';

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Logo from '../utils/Logo';

export default function Footer() {
  useEffect(() => {
    AOS.init({ duration: 800, easing: 'ease-in-out', once: true });
  }, []);

  return (
    <footer dir="rtl" className="border-t bg-white text-gray-700">
      <div className="container mx-auto flex flex-col gap-10 px-4 py-12 sm:px-6 md:flex-row md:justify-between lg:px-8">
        <div className="flex-1 space-y-4" data-aos="fade-up">
          <Logo />
          <p className="max-w-md text-sm leading-relaxed text-gray-600 sm:text-[15px]">
            منصة دروب ويف لإنشاء المتاجر الإلكترونية. أنشئ متجرك الإلكتروني في دقائق وابدأ البيع
            فوراً. منصة شاملة مع جميع الأدوات التي تحتاجها لنمو تجارتك.
          </p>
        </div>

        <div
          className="grid flex-1 grid-cols-2 gap-6 sm:grid-cols-3"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-800">روابط سريعة</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:text-primary transition">
                  الرئيسية
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">
                  الدعم
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">
                  المميزات
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-gray-800">الدعم</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:text-primary transition">
                  اتصل بنا
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">
                  الأسئلة الشائعة
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">
                  الشروط والأحكام
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-gray-800">متابعة</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:text-primary transition">
                  فيسبوك
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">
                  إنستغرام
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">
                  تويتر
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 py-4 text-center text-xs text-gray-500">
        جميع الحقوق محفوظة © 2025 دروب ويف.
      </div>
    </footer>
  );
}
