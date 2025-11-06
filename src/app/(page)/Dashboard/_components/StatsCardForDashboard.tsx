import { formatIQD } from '@/app/lib/utils/CalculateDiscountedPrice';
import { DollarSign, BarChart3, Users, ShoppingBag, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FiCopy } from 'react-icons/fi';
import { toast } from 'sonner';

export default function StatsCardForDashboard() {
  const router = useRouter();
  const storeUrl = `https://${2}.sahlapp.io`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(storeUrl);
      toast.success(`تم نسخ الرابط إلى الحافظة! \n${storeUrl}`);
    } catch (err) {
      console.error('فشل نسخ الرابط:', err);
    }
  };

  const itemsButton = [
    { name: 'الزيارات', number: 12, href: '/', icon: <Eye className="h-5 w-5" /> },
    { name: 'المبيعات', number: 8, href: '/', icon: <ShoppingBag className="h-5 w-5" /> },
    { name: 'المستخدمين', number: 25, href: '/', icon: <Users className="h-5 w-5" /> },
    { name: 'الإحصائيات', number: 5, href: '/', icon: <BarChart3 className="h-5 w-5" /> },
  ];

  return (
    <div dir="ltr" className="overflow-hidden rounded-xl border shadow-sm">
      {/* Header */}
      <div className="bg-[#292526] px-3 py-2 text-white">
        <div className="flex items-center justify-between gap-2">
          <span className="max-w-[200px] truncate text-sm font-medium select-text md:max-w-3xs">
            {storeUrl}
          </span>
          <button
            onClick={copyToClipboard}
            className="rounded-full p-2 transition hover:bg-gray-100 hover:text-black"
          >
            <FiCopy size={16} />
          </button>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-400" />
            <span className="text-sm font-semibold">{formatIQD(770000)}</span>
          </div>
        </div>
      </div>

      {/* Body */}
    <div className="flex gap-3">
  {itemsButton.map((e, i) => (
    <div key={i} className="flex flex-col items-center gap-1">
      <button
        onClick={() => router.push(e.href)}
        className="flex h-10 w-10 flex-col items-center justify-center rounded-full border bg-gray-50 shadow-sm transition hover:bg-gray-100"
      >
        <span className="text-gray-700 text-sm">{e.icon}</span>
      </button>
      <span className="text-[10px] font-medium text-gray-700">{e.name}</span>
      <span className="text-xs font-bold text-[#292526]">{e.number}</span>
    </div>
  ))}
</div>

    </div>
  );
}
