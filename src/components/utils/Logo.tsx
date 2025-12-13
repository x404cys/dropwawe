'use client';
import Image from 'next/image';

export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Image src="/logo-drop.png" alt="Sahl" width={35} height={35} />
      <div className="flex flex-col">
        <h1 className="text-sm md:text-xl">Dropwave</h1>
      </div>
    </div>
  );
}
