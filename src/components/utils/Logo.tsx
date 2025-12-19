'use client';
import Image from 'next/image';

export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="relative h-8 w-8 md:h-12 md:w-12">
        <Image src="/logo-drop.png" alt="Dropwave" fill className="object-contain" />
      </div>
      <div className="flex flex-col">
        <h1 className="text-sm font-semibold md:text-xl">Dropwave</h1>
      </div>
    </div>
  );
}
