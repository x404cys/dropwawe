'use client';
import Image from 'next/image';

export default function Logo() {
  return (
    <div className="flex flex-col items-center">
      <Image
        src="/logo-drop.png"
        alt="Sahl"
        width={50}
        height={50}
        className="h-15 w-15 md:h-16 md:w-16"
      />
      <div className="flex flex-col">
         <h1 className="text-sm md:text-xl">Dropwave</h1>
      </div>
    </div>
  );
}
