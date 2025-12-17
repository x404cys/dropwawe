'use client';
import Image from 'next/image';
import { Cpu, Store, ShoppingCart } from 'lucide-react';

export default function ProjectOwnersSection() {
  const sections = [
    {
      image: '/freepik__the-style-is-candid-image-photography-with-natural__53505.png',
      title: 'لأصحاب المشاريع على السوشيال ميديا',
      description:
        'انتقل من البيع العشوائي إلى نظام متكامل بإدارة مخزون، طلبات، تحليلات، وتسويق ذكي.',
      badge: 'سوشيال ميديا',
      icon: <Cpu className="ml-2 h-6 w-6 text-sky-500" />,
    },
    {
      image: '/fast-fashion-concept-with-full-clothing-store.jpg',
      title: 'لأصحاب المحلات',
      description: 'حوّل متجرك من نطاقه المحلي إلى مساحة بيع بلا حدود.',
      badge: 'محلات',
      icon: <Store className="ml-2 h-6 w-6 text-sky-500" />,
    },
    {
      image: '/showing-cart-trolley-shopping-online-sign-graphic.jpg',
      title: 'لكل شخص مهتم بالتجارة الإلكترونية',
      description:
        'ابدأ من الصفر واحصل على متجر إلكتروني جاهز، منتجات مختارة بعناية، محتوى تسويقي قابل للاستخدام مباشرة، وربط كامل ببوابات الدفع وشركات التوصيل.',
      badge: 'مبتدئ',
      icon: <ShoppingCart className="ml-2 h-6 w-6 text-sky-500" />,
    },
  ];

  return (
    <section dir="rtl" className="px-5 py-12 md:px-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="text-foreground mb-4 text-4xl font-bold text-balance md:text-5xl">
            لمن هذه المنصة؟
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg text-pretty">
            سواء كنت صاحب مشروع على السوشيال ميديا، محل تقليدي، أو مبتدئ في التجارة الإلكترونية
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {sections.map((section, index) => (
            <div
              key={index}
              className="group bg-card relative overflow-hidden rounded-lg shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-sm"
            >
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={section.image || '/placeholder.svg'}
                  alt={section.title}
                  fill
                  className="object-cover transition-transform duration-700"
                />
                <div className="absolute top-4 right-4">
                  <span className="text-primary-foreground inline-block rounded-full bg-sky-400 px-4 py-1.5 text-sm font-semibold">
                    {section.badge}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-card-foreground mb-4 flex items-center text-xl font-bold text-balance">
                  <span className="">{section.title}</span>
                </h3>

                <p className="text-muted-foreground mb-6 text-base leading-relaxed text-pretty">
                  {section.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ArrowLeft({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 19l-7-7m0 0l7-7m-7 7h18"
      />
    </svg>
  );
}
