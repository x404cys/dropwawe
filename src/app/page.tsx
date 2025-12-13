'use client';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Button } from '@/components/ui/button';
import { BarChart3, Shield, Headphones, Palette, Zap, AppWindow, ZapIcon } from 'lucide-react';
import Footer from '@/components/Footer/Footer';
import Logo from '@/components/utils/Logo';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTrackVisitor4landing } from './lib/context/SaveVisitorId';
import MockupMobile from '@/components/utils/MockupMobile';
import Image from 'next/image';
import HeroSection from '@/components/HeaderSections/HeaderSections';

const Page = () => {
  //
  const { data: session } = useSession();
  const router = useRouter();

  const features = [
    { icon: BarChart3, title: 'تحليلات مفصلة', description: 'تقارير شاملة عن المبيعات والعملاء' },
    { icon: Shield, title: 'أمان عالي', description: 'حماية متقدمة لبياناتك وبيانات عملائك' },
    { icon: Headphones, title: 'دعم فني 24/7', description: 'فريق دعم متخصص متاح في أي وقت' },
    {
      icon: Palette,
      title: 'تخصيص كامل',
      description: 'صمم متجرك بالطريقة التي تناسب علامتك التجارية',
    },
    { icon: Zap, title: 'سرعة فائقة', description: 'مواقع سريعة ومحسنة لمحركات البحث' },
    { icon: AppWindow, title: 'تصميم متجاوب', description: 'قوالب مصممة ومتجاوبة مع جميع الاجهزة' },
  ];

  useEffect(() => {
    AOS.init({ duration: 800, easing: 'ease-in-out', once: true });
  }, []);

  useTrackVisitor4landing('sahl2025');

  return (
    <HeroSection />
  );
};

export default Page;
