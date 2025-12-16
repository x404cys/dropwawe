import { Link, Package } from 'lucide-react';
import Image from 'next/image';

function PhoneMockup({ image, rotate, z }: { image: string; rotate: string; z: string }) {
  return (
    <div
      className={`relative h-[500px] w-[260px] transform rounded-[3rem] bg-black p-2 shadow-sm ${rotate} ${z}`}
    >
      <div className="absolute -top-7 -right-7 z-50 flex gap-1 rounded-full border bg-gradient-to-b from-sky-400 via-sky-500 to-sky-300 px-4 py-2 text-xs text-white shadow-lg">
        <p>store.dropwave.cloud</p>
        <Link size={12} />
      </div>

      <div className="absolute -bottom-7 -left-2 z-10 flex gap-1 rounded-full bg-gradient-to-b from-sky-400 via-sky-500 to-sky-300 px-4 py-2 text-xs font-semibold text-white shadow-lg">
        <p>تحليل وادارة الطلبات</p>
        <Package size={12} />
      </div>

      <div className="relative h-full w-full overflow-hidden rounded-[2.5rem] bg-white">
        <Image src={image} alt="mockup" fill className="object-contain" />
      </div>
    </div>
  );
}

export default function DoubleMobileMockup() {
  return (
    <div className="relative mx-auto flex items-center justify-center gap-6">
      <PhoneMockup image="/IMG_6060.PNG" rotate="rotate-6" z="z-10" />

      <PhoneMockup image="/IMG_6059.PNG" rotate=" " z="z-0" />
    </div>
  );
}
