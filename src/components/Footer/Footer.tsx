import Link from 'next/link';
import { Facebook, Instagram, Send, Mail, Phone } from 'lucide-react';
import { BsTelegram } from 'react-icons/bs';
import Image from 'next/image';
export default function Footer() {
  return (
    <footer className="bg-background border-border/50 border-t">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
          <div className="text-center md:col-span-5 md:text-start">
            <div className="flex items-center">
              <div className="relative h-8 w-8 md:h-8 md:w-12">
                <Image src="/logo-drop.png" alt="Dropwave" fill className="object-contain" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-sm font-semibold md:text-xl">Dropwave</h1>
              </div>
            </div>{' '}
            <p className="text-muted-foreground text-base leading-relaxed sm:text-lg">
              منصة التجارة الإلكترونية الحديثة التي توفر تجربة تسوق سلسة وآمنة
            </p>
            <div className="mt-6 flex justify-center gap-3 md:justify-start">
              <ul className="flex items-center justify-center gap-2">
                <li>
                  <a
                    href="https://www.facebook.com/profile.php?id=61555593490086&mibextid=ZbWKwL"
                    className="bg-muted/50 text-muted-foreground flex h-11 w-11 items-center justify-center rounded-lg transition-all hover:bg-sky-600 hover:text-sky-100"
                  >
                    <Facebook />
                  </a>
                </li>
                <li>
                  <a
                    className="bg-muted/50 text-muted-foreground flex h-11 w-11 items-center justify-center rounded-lg transition-all hover:bg-sky-600 hover:text-sky-100"
                    href="https://www.instagram.com/drop_wave_/"
                  >
                    <Instagram />
                  </a>
                </li>
                <li>
                  <a
                    className="bg-muted/50 text-muted-foreground flex h-11 w-11 items-center justify-center rounded-lg transition-all hover:bg-sky-600 hover:text-sky-100"
                    href="https://t.me/Dropwaveiq"
                  >
                    <BsTelegram className="h-6 w-6" />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center md:col-span-3 md:text-start">
            <h4 className="mb-4 text-base font-semibold">روابط سريعة</h4>
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

          <div className="text-center md:col-span-4 md:text-start">
            <h4 className="mb-4 text-base font-semibold">تواصل معنا</h4>
            <div className="flex flex-col items-center gap-4 md:items-start">
              <a
                href="mailto:support@dropwave.online"
                className="group text-muted-foreground hover:text-foreground flex items-center gap-3"
              >
                <div className="bg-muted/30 group-hover:bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
                  <Mail className="h-4 w-4" />
                </div>
                <span>support@dropwave.online</span>
              </a>

              <a
                href="tel:+1234567890"
                className="group text-muted-foreground hover:text-foreground flex items-center gap-3"
              >
                <div className="bg-muted/30 group-hover:bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
                  <Phone className="h-4 w-4" />
                </div>
                <span dir="ltr">+123 456 7890</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-border/50 border-t pt-6">
          <p className="text-muted-foreground text-center text-sm">
            © 2025 Drop Wave. جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    </footer>
  );
}
