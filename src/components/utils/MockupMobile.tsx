import { Link, Package } from 'lucide-react';
import Image from 'next/image';

export default function MockupMobile() {
  return (
    <div className="relative mx-auto h-[500px] w-70 rounded-[3rem] bg-black p-2 shadow-2xl">
      <div className="absolute -top-7 -right-7 z-50 flex gap-1 rounded-full border-1 border-black bg-gray-950 px-4 py-2 text-xs text-white shadow-lg">
        <p>store.dropwave.cloud </p> <Link size={12} />
      </div>
      <div className="absolute -bottom-7 -left-2 z-10 flex gap-1 rounded-full bg-black px-4 py-2 text-xs font-semibold text-white shadow-lg">
        <p> تحليل وادارة الطلبات</p> <Package size={12} />
      </div>
      <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[2.5rem] bg-white">
        <div className="absolute inset-0">
          <Image src={'/IMG_5025.PNG'} alt="2" fill className="object-contain" />
        </div>
      </div>
    </div>
  );
}
