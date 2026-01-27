'use client';
import Image from 'next/image';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useRouter } from 'next/navigation';
export default function HeroSection() {
  const router = useRouter();
  useEffect(() => {
    AOS.init({ duration: 800, easing: 'ease-in-out', once: false });
  }, []);
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-400 via-sky-500 to-cyan-400">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.25),transparent_60%)]" />

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-8 pt-28 text-center text-white md:gap-10">
        <div
          data-aos="fade-up"
          data-aos-anchor-placement="top-bottom"
          data-aos-delay="100"
          className="mt-8 flex flex-col items-center gap-2 space-y-6 md:space-y-0"
        >
          <h1 className="font-landing text-4xl md:text-5xl md:leading-snug">
            ضغطة واحدة تفصلك <br /> عن النجاح في التجارة الالكترونية
          </h1>
          <div className="mt-4">
            <p className="max-w-xl text-xl leading-relaxed text-sky-800">
              اطلق مشروعك خلال دقائق فقط،
            </p>
            <p className="max-w-xl text-lg leading-relaxed text-sky-800">
              ارتقِ بمشروعك واستقبل طلباتك على متجرك الالكتروني مع بوابة دفع امنة وربط مع شركات
              التوصيل.
            </p>
          </div>
        </div>

        <div
          data-aos="fade-up"
          data-aos-anchor-placement="bottom-bottom"
          data-aos-delay="200"
          className="mt-4 flex w-full items-center justify-center gap-4"
        >
          <button
            onClick={() => router.push('https://login.matager.store')}
            className="relative cursor-pointer rounded-full bg-gradient-to-l from-sky-800/80 from-5% via-sky-800/80 via-60% to-sky-800/90 to-80% px-8 py-2 font-bold text-white shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),_0_6px_20px_rgba(0,150,200,0.35)] ring-2 ring-white/70 backdrop-blur-lg transition-all duration-300 hover:scale-105"
          >
            سجل
            <span className="pointer-events-none absolute inset-0 rounded-full shadow-[0_0_12px_2px_rgba(255,255,255,0.6)] ring-1 ring-white/70" />
          </button>

          <button
            onClick={() => router.push('/Test-Mode/Dashboard')}
            className="relative cursor-pointer rounded-full bg-gradient-to-l from-sky-300/80 from-5% via-sky-200/80 via-60% to-sky-200/90 to-80% px-8 py-2 font-bold text-sky-900 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),_0_6px_20px_rgba(0,150,200,0.35)] ring-2 ring-white/70 backdrop-blur-lg transition-all duration-300 hover:scale-105"
          >
            جرب المنصة
            <span className="pointer-events-none absolute inset-0 rounded-full shadow-[0_0_12px_2px_rgba(255,255,255,0.6)] ring-1 ring-white/70" />
          </button>
        </div>

        <div className="relative flex items-end justify-center gap-8 md:gap-20">
          <div
            data-aos="fade-up"
            data-aos-anchor-placement="bottom-bottom"
            data-aos-delay="200"
            className="floating-slow glass-card floating-slow relative rotate-6 rounded-3xl border border-white/30 bg-white/15 p-4 shadow-[0_8px_32px_rgba(0,0,0,0.15)] backdrop-blur-2xl"
          >
            <Image
              className="absolute -top-12 -rotate-12 md:-top-4 md:left-1/1 md:-translate-x-1/2 md:rotate-12"
              src="/Logo-Matager/star-struck_1f929.png"
              alt="star"
              width={45}
              height={45}
            />

            <div className="rounded-2xl bg-white/90 p-3">
              <Image
                src="/img-landing-page/9.png"
                alt="product"
                width={80}
                height={80}
                className="rounded-xl"
              />
            </div>

            <button className="relative mt-3 w-full rounded-full bg-sky-800 py-2 text-sm text-white">
              أضف للسلة
              <span className="pointer-events-none absolute inset-0 rounded-full shadow-[0_0_12px_2px_rgba(255,255,255,0.6)] ring-1 ring-white/70" />
            </button>
          </div>

          <div
            data-aos="fade-up"
            data-aos-anchor-placement="bottom-bottom"
            data-aos-delay="200"
            className="floating-fast glass-card relative -rotate-6 rounded-3xl border border-white/30 bg-white/15 p-4 shadow-[0_8px_32px_rgba(0,0,0,0.15)] ring-1 ring-white/20 backdrop-blur-2xl"
          >
            <Image
              className="absolute -top-6 -left-2 -rotate-6"
              src="/Logo-Matager/money-with-wings_1f4b8.png"
              alt="money"
              width={56}
              height={56}
            />

            <div className="rounded-2xl bg-white/90 p-3">
              <Image
                src="/img-landing-page/10.png"
                alt="product"
                width={90}
                height={90}
                className="rounded-xl"
              />
            </div>

            <button className="relative mt-3 w-full rounded-full bg-sky-800 py-2 text-sm text-white">
              أضف للسلة
              <span className="pointer-events-none absolute inset-0 rounded-full shadow-[0_0_12px_2px_rgba(255,255,255,0.6)] ring-1 ring-white/70" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
