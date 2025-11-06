import {
  CheckCircle,
  Package,
  Globe,
  DollarSign,
  CreditCard,
  Truck,
  Headphones,
} from 'lucide-react';

export default function FeatureSection() {
  const features = [
    {
      icon: <Package className="h-8 w-8" />,
      title: 'منتجات بيع ناجحة',
      desc: 'منتجات مختارة بعناية من موردين موثوقين مع ضمان نسبة بيع عالية',
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: 'موقع إلكتروني خاص',
      desc: 'احصل على موقعك الإلكتروني الخاص لعرض وبيع المنتجات بسهولة',
    },
    {
      icon: <DollarSign className="h-8 w-8" />,
      title: 'هامش ربحي ممتاز',
      desc: 'أرباح مضمونة مع هوامش ربحية مريحة تضمن لك دخل ثابت',
    },
    {
      icon: <CreditCard className="h-8 w-8" />,
      title: 'دفع الكتروني أو عند الاستلام',
      desc: 'خيارات دفع متنوعة - دفع الكتروني آمن أو دفع عند استلام البضاعة',
    },
    {
      icon: <Truck className="h-8 w-8" />,
      title: 'شحن سريع ومضمون',
      desc: 'شبكة توصيل قوية تضمن وصول الطلبات للزبائن بأسرع وقت',
    },
    {
      icon: <Headphones className="h-8 w-8" />,
      title: 'دعم فني مستمر',
      desc: 'فريق مساعدة متاح دائماً لحل أي مشكلة أو استفسار',
    },
  ];

  return (
    <section aria-label="لماذا تختار منصة سهل؟" className="mx-auto max-w-5xl px-6 py-20 text-right">
      <div className="mx-auto mb-12 max-w-3xl text-center">
        <h2 className="mb-4 text-4xl font-bold tracking-tight text-black">ليش تختار سهل؟</h2>
        <h3 className="text-lg leading-relaxed font-medium text-gray-600">
          منصة متكاملة تربط الموردين مع البائعين وتسهل عملية الدروب شيبينج بطريقة مهنية ومربحة
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(({ icon, title, desc }, idx) => (
          <div
            key={idx}
         className="flex flex-col rounded-xl border border-gray-300 bg-white p-7 shadow-sm transition-transform duration-200 ease-in-out hover:scale-[1.02] hover:shadow-md">

            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border-2 border-black text-black">
              {icon}
            </div>
            <h3 className="mb-3 text-lg font-semibold text-[color:var(--green)]">{title}</h3>
            <p className="text-sm leading-relaxed text-gray-700">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
