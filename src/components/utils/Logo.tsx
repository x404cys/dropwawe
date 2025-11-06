'use client';
import Image from 'next/image';

export default function Logo() {
  return (
    <div className="flex items-center">
      <Image
        src="/IMG_3549.PNG"
        alt="Sahl"
        width={50}
        height={50}
        className="h-15 w-15 md:h-16 md:w-16"
      />
      <div className="flex flex-col">
        <h1 className="text-lg font-bold md:text-2xl">سهل</h1>
        <h1 className="text-sm md:text-xl">Sahl</h1>
      </div>
    </div>
  );
}
