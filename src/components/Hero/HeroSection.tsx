import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, ShoppingBag, Users, TrendingUp, Sparkles, ArrowLeft } from 'lucide-react';

const Hero = () => {
  return (
    <section className="bg-gradient-hero relative min-h-screen overflow-hidden text-white">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="animate-float absolute top-20 left-10 h-20 w-20 rounded-full bg-white/5 blur-xl"></div>
        <div
          className="bg-accent-emerald/10 animate-float absolute top-40 right-20 h-32 w-32 rounded-full blur-2xl"
          style={{ animationDelay: '1s' }}
        ></div>
        <div
          className="bg-accent-purple/10 animate-float absolute bottom-40 left-20 h-24 w-24 rounded-full blur-xl"
          style={{ animationDelay: '2s' }}
        ></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-32 pb-20">
        <div className="text-center">
          {/* Enhanced Badge */}
          <Badge
            variant="secondary"
            className="glass group mb-8 cursor-pointer border-white/20 px-6 py-3 text-sm font-semibold text-white transition-transform duration-300 hover:scale-105"
          >
            <Sparkles className="text-accent-orange ml-2 h-4 w-4" />
            <span>أكثر من 1000+ متجر نشط</span>
          </Badge>

          {/* Enhanced Main heading */}
          <div className="animate-fade-up mb-8">
            <h1 className="font-arabic mb-4 text-6xl leading-none font-bold md:text-7xl lg:text-8xl">
              <span className="block text-balance">منصة</span>
              <span className="via-accent-emerald-light block bg-gradient-to-r from-white to-white bg-clip-text text-transparent">
                سهل
              </span>
            </h1>
            <p className="font-arabic text-3xl font-semibold text-white/90 md:text-4xl">
              لإنشاء المتاجر الإلكترونية
            </p>
          </div>

          {/* Enhanced Description */}
          <p
            className="font-arabic animate-fade-up mx-auto mb-12 max-w-4xl text-xl leading-relaxed text-balance text-white/80 md:text-2xl"
            style={{ animationDelay: '0.2s' }}
          >
            أنشئ متجرك الإلكتروني في دقائق وابدأ البيع فوراً. منصة شاملة وسهلة الاستخدام مع جميع
            الأدوات التي تحتاجها لنمو تجارتك الإلكترونية.
          </p>

          {/* Enhanced CTA Buttons */}
          <div
            className="animate-fade-up mb-20 flex flex-col items-center justify-center gap-4 sm:flex-row"
            style={{ animationDelay: '0.4s' }}
          >
            <Button
              size="lg"
              className="text-primary group bg-white px-10 py-6 text-xl font-bold shadow-xl transition-all duration-300 hover:scale-105 hover:bg-white/95 hover:shadow-2xl"
            >
              <span>ابدأ متجرك مجاناً</span>
              <ArrowLeft className="mr-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="glass group border border-white/20 px-10 py-6 text-xl font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-white/10"
            >
              <Play className="ml-3 h-5 w-5 transition-transform group-hover:scale-110" />
              <span>شاهد العرض التوضيحي</span>
            </Button>
          </div>

          {/* Enhanced Statistics */}
          <div
            className="animate-fade-up mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3"
            style={{ animationDelay: '0.6s' }}
          >
            {[
              {
                icon: ShoppingBag,
                number: '+1000',
                label: 'متجر نشط',
                color: 'text-accent-emerald-light',
              },
              { icon: Users, number: '+50K', label: 'عميل راضي', color: 'text-accent-orange' },
              {
                icon: TrendingUp,
                number: '99.9%',
                label: 'وقت التشغيل',
                color: 'text-accent-purple',
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="group cursor-pointer transition-all duration-300 hover:scale-105"
              >
                <div className="glass rounded-2xl border border-white/10 p-8 transition-all duration-300 hover:border-white/20">
                  <div className="mb-4 flex items-center justify-center">
                    <div
                      className={`rounded-xl bg-white/10 p-3 ${stat.color} transition-transform duration-300 group-hover:scale-110`}
                    >
                      <stat.icon className="h-8 w-8" />
                    </div>
                  </div>
                  <div className="mb-2 text-5xl font-bold transition-transform duration-300 group-hover:scale-105 md:text-6xl">
                    {stat.number}
                  </div>
                  <p className="text-lg font-semibold text-white/70">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Bottom curve */}
      <div className="absolute right-0 bottom-0 left-0">
        <svg viewBox="0 0 1440 320" className="text-background h-32 w-full">
          <path
            fill="currentColor"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,133.3C960,128,1056,96,1152,90.7C1248,85,1344,107,1392,117.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
