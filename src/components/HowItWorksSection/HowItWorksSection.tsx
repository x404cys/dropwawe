import {
  UserPlus,
  Box,
  ShoppingBag,
  DollarSign,
  Users,
  UploadCloud,
  Inbox,
  TrendingUp,
  User,
  Handshake,
   UserPlus2Icon
} from 'lucide-react';

const sellerSteps = [
  {
    icon: <UserPlus className="h-6 w-6" />,
    title: 'سجل حسابك',
    desc: 'أنشئ حسابك المجاني واختر فئة المنتجات التي تريد بيعها',
  },
  {
    icon: <Box className="h-6 w-6" />,
    title: 'اختر المنتجات',
    desc: 'تصفح كتالوج المنتجات واختر ما يناسب جمهورك المستهدف',
  },
  {
    icon: <ShoppingBag className="h-6 w-6" />,
    title: 'ابدأ البيع',
    desc: 'انشر المنتجات في متجرك أو قنوات التواصل الاجتماعي وابدأ البيع',
  },
  {
    icon: <DollarSign className="h-6 w-6" />,
    title: 'احصل على أرباحك',
    desc: 'نحن نتولى الشحن والتوصيل، وأنت تحصل على أرباحك فوراً',
  },
];

const supplierSteps = [
  {
    icon: <Users className="h-6 w-6" />,
    title: 'انضم كمورد',
    desc: 'سجل كمورد وارفع معلومات شركتك والمنتجات المتوفرة',
  },
  {
    icon: <UploadCloud className="h-6 w-6" />,
    title: 'أضف منتجاتك',
    desc: 'ارفع كتالوج منتجاتك مع الصور والأسعار والمواصفات',
  },
  {
    icon: <Inbox className="h-6 w-6" />,
    title: 'استقبل الطلبات',
    desc: 'استقبل الطلبات من البائعين وجهز المنتجات للشحن',
  },
  {
    icon: <TrendingUp className="h-6 w-6" />,
    title: 'زد مبيعاتك',
    desc: 'وسع قاعدة عملائك واحصل على المزيد من الطلبات',
  },
];

export default function HowItWorksSection() {
  return (
    <section
      aria-label="شلون يشتغل سهل؟"
      dir="rtl"
      className="mx-auto max-w-7xl px-6 py-20 text-right"
    >
      <div className="mx-auto mb-16 max-w-3xl text-center">
        <h2 className="mb-3 text-4xl font-bold tracking-tight text-[color:var(--green)]">
          شلون يشتغل سهل؟
        </h2>
        <p className="text-lg font-medium text-gray-700">عملية بسيطة وسهلة تبدأ بيها تجارتك</p>
      </div>

      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        <div>
          <div className="mb-8 flex items-center gap-3 border-b border-gray-300 pb-3">
            <UserPlus2Icon className="h-6 w-6 text-[color:var(--green)]" />
            <h3 className="text-2xl font-semibold">للبائعين</h3>
          </div>
          <ol className="space-y-8">
            {sellerSteps.map(({ icon, title, desc }, idx) => (
              <li key={idx} className="flex items-center gap-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[color:var(--green)] text-lg font-bold text-[color:var(--green)]">
                  {idx + 1}
                </div>
                <div className="flex flex-col">
                  <div className="mb-1 flex items-center gap-3">
                    <div>{icon}</div>
                    <h4 className="text-lg font-semibold">{title}</h4>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-600">{desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div>
            <div className="mb-8 flex items-center gap-3 border-b border-gray-300 pb-3">
        <Handshake className="h-6 w-6 text-[color:var(--green)]" />
        <h3 className="text-2xl font-semibold">للموردين</h3>
      </div>
          <ol className="space-y-8">
            {supplierSteps.map(({ icon, title, desc }, idx) => (
              <li key={idx} className="flex items-center gap-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[color:var(--green)] text-lg font-bold text-[color:var(--green)]">
                  {idx + 1}
                </div>
                <div className="flex flex-col">
                  <div className="mb-1 flex items-center gap-3">
                    <div>{icon}</div>
                    <h4 className="text-lg font-semibold">{title}</h4>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-600">{desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
