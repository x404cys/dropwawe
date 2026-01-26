import Link from 'next/link';
import { Facebook, Instagram, Send, Mail, Phone } from 'lucide-react';
import { BsTelegram } from 'react-icons/bs';
import Image from 'next/image';
export default function Footer() {
  return (
    <footer id="ContactSection" className="border-border/50 border-t bg-[#003952]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
          <div className="text-center md:col-span-5 md:text-start">
            <div className="flex flex-col items-center justify-center gap-2 md:flex-none md:flex-row md:justify-start">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 md:h-25 md:w-12">
                  <Image
                    src="/Logo-Matager/Matager-logo22.png"
                    alt="Dropwave"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <h1 className="text-lg font-semibold text-white md:text-xl">
                    منصة متاجر - Matager
                  </h1>
                </div>
              </div>{' '}
            </div>
            <p className="text-muted-foreground text-base leading-relaxed text-white sm:text-lg">
              منصة التجارة الإلكترونية الحديثة التي توفر تجربة تسوق سلسة وآمنة
            </p>
            <div className="mt-6 flex justify-center gap-3 md:justify-start">
              <ul className="flex items-center justify-center gap-2">
                <li>
                  <a
                    href="https://www.facebook.com/profile.php?id=61555593490086&mibextid=ZbWKwL"
                    className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 transition-all hover:bg-sky-600 hover:text-sky-100"
                  >
                    <Facebook />
                  </a>
                </li>
                <li>
                  <a
                    className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 transition-all hover:bg-sky-600 hover:text-sky-100"
                    href="https://www.instagram.com/drop_wave_/"
                  >
                    <Instagram />
                  </a>
                </li>
                <li>
                  <a
                    className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 transition-all hover:bg-sky-600 hover:text-sky-100"
                    href="https://t.me/Dropwaveiq"
                  >
                    <BsTelegram className="h-6 w-6" />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center text-white md:col-span-3 md:text-start">
            <h4 className="mb-4 text-base font-semibold text-white">روابط سريعة</h4>
            <nav className="flex flex-col items-center gap-3 md:items-start">
              <a href="/" className="footer-a">
                الرئيسية
              </a>
              <a
                onClick={() => {
                  const checkoutSection = document.getElementById('PricingSection');
                  if (checkoutSection) {
                    checkoutSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                href="#pricing"
                className="footer-a"
              >
                الأسعار
              </a>
              <a
                onClick={() => {
                  const checkoutSection = document.getElementById('FAQ');
                  if (checkoutSection) {
                    checkoutSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                href="#about"
                className="footer-a"
              >
                الاسئلة الشائعة
              </a>
            </nav>
          </div>

          <div className="text-center text-white md:col-span-4 md:text-start">
            <h4 className="mb-4 text-base font-semibold">تواصل معنا</h4>
            <div className="flex flex-col items-center gap-4 md:items-start">
              <a
                href="mailto:support@dropwave.online"
                className="group text-muted-foreground hover:text-foreground flex items-center gap-3"
              >
                <div className="bg-muted/30 group-hover: flex h-10 w-10 items-center justify-center rounded-lg">
                  <Mail className="h-4 w-4 text-white hover:text-black" />
                </div>
                <span className="text-white">support@dropwave.online</span>
              </a>

              <a href="tel:+1234567890" className="group flex items-center gap-3 text-white">
                <div className="bg-muted/30 flex h-10 w-10 items-center justify-center rounded-lg">
                  <Phone className="h-4 w-4" />
                </div>
                <span dir="ltr" className="pl-20 md:pl-0">
                  +123 456 7890
                </span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-border/50 border-t pt-6">
          <p className="text-center text-sm text-white">جميع الحقوق محفوظة لمنصة متاجر 2026 ©</p>
        </div>
      </div>
    </footer>
  );
}
