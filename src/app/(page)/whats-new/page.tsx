import Image from 'next/image';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  CreditCard,
  Gift,
  LayoutDashboard,
  Link2,
  MousePointerClick,
  Palette,
  Rocket,
  Sparkles,
  WandSparkles,
} from 'lucide-react';

type SummaryItem = {
  title: string;
  icon: LucideIcon;
};

type FeatureItem = {
  id: string;
  title: string;
  description: string;
  badge: string;
  badgeTone: 'new' | 'improved' | 'free';
  icon: LucideIcon;
  href: string;
  bullets: string[];
  featured?: boolean;
};

const summaryItems: SummaryItem[] = [
  { title: 'تصميم جديد', icon: Palette },
  { title: 'تحليلات متقدمة', icon: BarChart3 },
  { title: 'روابط دفع', icon: Link2 },
  { title: 'تحسين الأداء', icon: Rocket },
];

const featureItems: FeatureItem[] = [
  {
    id: 'ui-redesign',
    title: 'إعادة تصميم الواجهة',
    description: 'واجهة أوضح، أخف بصريًا، وأسهل في المتابعة اليومية.',
    badge: 'محسن',
    badgeTone: 'improved',
    icon: Palette,
    href: '/Dashboard',
    featured: true,
    bullets: ['تنظيم بصري أنظف للصفحات', 'بطاقات أوضح ومسافات أهدأ', 'وصول أسرع للأدوات المهمة'],
  },
  {
    id: 'usability',
    title: 'تحسين تجربة الاستخدام',
    description: 'تقليل الاحتكاك في الاستخدام اليومي داخل لوحة التحكم.',
    badge: 'محسن',
    badgeTone: 'improved',
    icon: Sparkles,
    href: '/Dashboard',
    bullets: ['خطوات أقل للوصول للمهام', 'وضوح أفضل داخل الأقسام', 'قراءة أسرع للمحتوى والبيانات'],
  },
  {
    id: 'quick-actions',
    title: 'Quick Actions',
    description: 'اختصارات مباشرة لتنفيذ أكثر المهام تكرارًا بسرعة.',
    badge: 'محسن',
    badgeTone: 'improved',
    icon: MousePointerClick,
    href: '/Dashboard',
    bullets: ['بدء أسرع من الصفحة الرئيسية', 'اختصارات للمهام اليومية', 'تقليل التنقل داخل اللوحة'],
  },
  {
    id: 'analytics',
    title: 'تحليلات متقدمة',
    description: 'رؤية أوضح للأداء حتى تفهم ما يحدث خلال ثوانٍ.',
    badge: 'جديد',
    badgeTone: 'new',
    icon: BarChart3,
    href: '/Dashboard/stats',
    featured: true,
    bullets: [
      'المحافظات والأجهزة ومصادر الزوار',
      'المنتجات الأكثر مبيعًا',
      'قراءة طرق الدفع والأداء البيعي',
      'عرض أسرع للتقارير المهمة',
    ],
  },
  {
    id: 'payment-links',
    title: 'روابط الدفع',
    description: 'أنشئ رابط دفع وشاركه مباشرة مع العميل بدون خطوات إضافية.',
    badge: 'جديد',
    badgeTone: 'new',
    icon: CreditCard,
    href: '/Dashboard/payment-links',
    bullets: [
      'مناسب للمحادثات والطلبات السريعة',
      'رابط مباشر قابل للمشاركة',
      'تجربة دفع أوضح وأسرع',
    ],
  },
  {
    id: 'templates',
    title: 'تخصيص القوالب',
    description: 'تحكم أبسط في شكل المتجر وهوية العرض.',
    badge: 'محسن',
    badgeTone: 'improved',
    icon: WandSparkles,
    href: '/Dashboard/setting/store/template',
    bullets: [
      'تخصيص أقسام الواجهة الرئيسية',
      'تعديل القالب والمحتوى بسهولة',
      'مظهر أكثر احترافية للمتجر',
    ],
  },
  {
    id: 'plans',
    title: 'تحديث الباقات',
    description: 'البداية أسهل الآن مع مرونة أفضل قبل الترقية.',
    badge: 'مجاني',
    badgeTone: 'free',
    icon: Gift,
    href: '/Dashboard/plans',
    featured: true,
    bullets: [
      'الباقة الأساسية مجانية',
      'تجربة 3 أيام للباقات الأخرى',
      'قرار ترقية أسهل بعد التجربة',
    ],
  },
];

const badgeStyles: Record<FeatureItem['badgeTone'], string> = {
  new: 'border-primary/20 bg-primary/10 text-primary',
  improved: 'border-border bg-muted/70 text-muted-foreground',
  free: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
};

function BrandMark() {
  return (
    <div className="mx-auto flex w-fit items-center gap-3">
      <Image
        src="/Logo-Matager/Matager-logo1.PNG"
        className="border-primary/25 bg-card h-11 w-11 rounded-xl border object-cover"
        alt="Matager"
        width={200}
        height={200}
      />

      <div className="text-right">
        <div className="text-foreground text-sm font-bold tracking-[0.16em] uppercase">
          منصة متاجر
        </div>
        <div className="text-muted-foreground text-xs font-medium">What&apos;s New</div>
      </div>
    </div>
  );
}

function SummaryCard({ item }: { item: SummaryItem }) {
  const Icon = item.icon;

  return (
    <div className="bg-card border-border group rounded-[24px] border px-5 py-4 text-center shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="bg-primary/10 text-primary mx-auto flex h-11 w-11 items-center justify-center rounded-[16px] transition-transform duration-200 group-hover:scale-[1.03]">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-foreground mt-3 text-sm font-bold sm:text-base">{item.title}</h3>
    </div>
  );
}

function FeatureCard({ item }: { item: FeatureItem }) {
  const Icon = item.icon;

  return (
    <article
      className={[
        'bg-card rounded-[28px] p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-6',
        item.featured
          ? 'border-primary/20 bg-primary/[0.035] dark:bg-primary/[0.08]'
          : 'border-border',
      ].join(' ')}
    >
      <div className="flex items-start gap-4">
        <div
          className={[
            'flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px]',
            item.featured ? 'bg-primary/14 text-primary' : 'bg-primary/8 text-primary',
          ].join(' ')}
        >
          <Icon className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <span
            className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold ${badgeStyles[item.badgeTone]}`}
          >
            {item.badge}
          </span>

          <h3 className="text-foreground mt-3 text-lg font-bold">{item.title}</h3>
          <p className="text-muted-foreground mt-2 text-sm leading-7">{item.description}</p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {item.bullets.map(point => (
          <div key={point} className="flex items-start gap-3">
            <CheckCircle2 className="text-primary mt-1 h-4.5 w-4.5 shrink-0" />
            <p className="text-foreground/85 text-sm leading-7">{point}</p>
          </div>
        ))}
      </div>

      <div className="border-border/80 mt-6 border-t pt-5">
        <Link
          href={item.href}
          className={[
            'inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-semibold transition-all duration-200 sm:w-auto',
            item.featured
              ? 'bg-[#2DA6C8] text-white shadow-[0_14px_28px_rgba(45,166,200,0.20)] hover:bg-[#2799B8]'
              : 'border-border bg-background text-foreground hover:bg-accent/50 border',
          ].join(' ')}
        >
          اذهب للميزة
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}

export default function WhatsNewPage() {
  return (
    <main dir="rtl" className="bg-background min-h-screen px-2 py-2 sm:py-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:gap-6">
        <section className="relative overflow-hidden px-5 py-8 text-center sm:px-8 sm:py-10">
          <div className="bg-primary/10 absolute top-6 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full blur-3xl dark:opacity-70" />
          <div className="bg-primary/6 absolute top-16 right-6 h-24 w-24 rounded-full blur-2xl dark:opacity-80" />

          <div className="relative mx-auto max-w-3xl">
            <BrandMark />

            <div className="mt-5 flex items-center justify-center">
              <span className="border-primary/20 bg-primary/10 text-primary rounded-full border px-4 py-1.5 text-xs font-semibold">
                Version 2.0
              </span>
            </div>

            <h1 className="text-foreground mt-5 text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
              <span> تحديث كبير على المنصة</span>{' '}
              <Rocket className="text-primary inline-block h-6 w-6 md:h-9 md:w-9" />
            </h1>

            <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-sm leading-8 sm:text-base">
              واجهة أوضح، تحليلات أعمق، وتجربة أسرع تساعدك على إدارة المتجر واكتشاف الميزات الجديدة
              بسهولة.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="#features"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#2DA6C8] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(45,166,200,0.20)] transition-all duration-200 hover:bg-[#2898B7] sm:w-auto"
              >
                استكشف التحديثات
                <ArrowLeft className="h-4 w-4" />
              </Link>

              <Link
                href="/Dashboard"
                className="border-border bg-card text-foreground hover:bg-accent/50 inline-flex w-full items-center justify-center gap-2 rounded-full border px-6 py-3.5 text-sm font-semibold transition-all duration-200 sm:w-auto"
              >
                الذهاب للوحة التحكم
                <LayoutDashboard className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="rounded-[30px] px-5 py-6 shadow-sm sm:px-6 sm:py-7">
          <div className="text-center">
            <p className="text-primary text-sm font-semibold">ملخص سريع</p>
            <h2 className="text-foreground mt-2 text-xl font-black sm:text-2xl">
              أهم ما سيلفت انتباهك فورًا
            </h2>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {summaryItems.map(item => (
              <SummaryCard key={item.title} item={item} />
            ))}
          </div>
        </section>

        <section id="features" className="rounded-[30px] px-5 py-6 shadow-sm sm:px-6 sm:py-7">
          <div className="text-center">
            <p className="text-primary text-sm font-semibold">آخر التحديثات</p>
            <h2 className="text-foreground mt-2 text-xl font-black sm:text-2xl">
              ميزات جديدة وتحسينات واضحة
            </h2>
            <p className="text-muted-foreground mx-auto mt-3 max-w-2xl text-sm leading-7">
              كل بطاقة مختصرة ومباشرة حتى تفهم الفائدة بسرعة وتذهب للميزة فورًا.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {featureItems.map(item => (
              <FeatureCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
