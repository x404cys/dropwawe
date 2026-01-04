import { Link, Package } from 'lucide-react';
import Image from 'next/image';

function PhoneMockup({
  image,
  rotate,
  z,
  pos,
  hid,
}: {
  image: string;
  rotate: string;
  z: string;
  pos: string;
  hid: string;
}) {
  return (
    <div
      className={`relative h-[500px] w-[260px] transform rounded-[3rem] bg-black p-2 shadow-sm ${rotate} ${z} ${pos}`}
    >
      <div
        className={`${hid} absolute -top-7 -right-7 z-50 flex gap-1 rounded-full border bg-gradient-to-b from-sky-700 via-sky-700 to-sky-300 px-4 py-2 text-xs text-white shadow-lg`}
      >
        <p>store.dropwave.cloud</p>
        <Link size={12} />
      </div>

      <div
        className={` ${hid} absolute -bottom-7 -left-2 z-10 flex gap-1 rounded-full bg-gradient-to-b from-sky-700 via-sky-700 to-sky-300 px-4 py-2 text-xs font-semibold text-white shadow-lg`}
      >
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
      <div className="absolute -top-12 left-0 -z-20 h-48 w-48 translate-x-1/3 rounded-full bg-sky-700/30 blur-xl"></div>
      <div className="absolute right-0 -bottom-12 -z-20 h-48 w-48 -translate-x-1/3 rounded-full bg-sky-700/30 blur-xl"></div>

      <PhoneMockup
        image="/img-theme/IMG_6258.PNG"
        pos="-translate-x-18"
        hid="hidden"
        rotate="rotate-"
        z="z-10"
      />

      <PhoneMockup image="/IMG_6059.PNG" pos="-" hid="hidden" rotate="r" z="z-10" />
    </div>
  );
}
