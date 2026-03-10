import Image from 'next/image';
import Link from 'next/link';
import { RiScrollToBottomLine } from 'react-icons/ri';

interface HeroBannerProps {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  ctaText?: string;
  ctaLink?: string;
}

export default function HeroBanner({
  title,
  subtitle,
  description,
  image,
  ctaText = 'تسوق الآن',
  ctaLink = '#',
}: HeroBannerProps) {
  return (
    <section
      dir="rtl"
      className="xs:h-[350px] relative mb-8 h-[400px] w-full overflow-hidden md:h-[90vh]"
    >
      <Image
        src={image}
        alt={title}
        fill
        priority
        className="h-full w-full object-cover blur-[2px]"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

      <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-8 md:px-20">
        <span className="mb-2 text-xs tracking-widest text-white drop-shadow-lg sm:text-sm">
          {subtitle}
        </span>
        <h1 className="mb-4 text-2xl font-extrabold text-white drop-shadow-xl sm:text-3xl md:text-6xl">
          {title}
        </h1>
        <p className="mb-6 max-w-full text-sm text-white drop-shadow-lg sm:max-w-lg sm:text-base md:text-lg">
          {description}
        </p>
        <button className="inline-block w-28 cursor-pointer bg-white px-4 py-2 text-xs font-semibold text-black transition hover:bg-gray-200 sm:px-8 sm:py-3 sm:text-sm md:w-42">
          {ctaText}
        </button>
      </div>
    </section>
  );
}
