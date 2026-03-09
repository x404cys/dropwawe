import { useState } from 'react';
import { Wallet, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '../../../context/LanguageContext';

interface WithdrawDialogProps {
  availableBalance: number;
}

export function WithdrawDialog({ availableBalance }: WithdrawDialogProps) {
  const { t } = useLanguage();
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');

  const handleWithdraw = () => {
    const amount = parseInt(withdrawAmount);
    if (!amount || amount <= 0 || amount > availableBalance) {
      toast.error('يرجى إدخال مبلغ صحيح');
      return;
    }
    toast.success(`طلب سحب ${amount.toLocaleString('ar-IQ')} ${t.currency} قيد المراجعة`);
    setWithdrawAmount('');
    setWithdrawOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setWithdrawOpen(o => !o)}
        className="bg-primary text-primary-foreground flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold"
      >
        <Wallet className="h-4 w-4" />
        طلب سحب
      </button>
      {withdrawOpen && (
        <div className="bg-card border-border absolute top-11 left-0 z-50 w-64 space-y-3 rounded-2xl border p-4 shadow-xl">
          <p className="text-foreground text-center text-sm font-bold">طلب سحب أرباح</p>
          <div className="bg-secondary/50 rounded-xl p-3 text-center">
            <p className="text-muted-foreground text-[11px]">الرصيد المتاح</p>
            <p className="text-foreground text-xl font-bold">
              {availableBalance.toLocaleString('ar-IQ')}
              <span className="text-muted-foreground mr-1 text-xs">{t.currency}</span>
            </p>
          </div>
          <div>
            <label className="text-foreground mb-1.5 block text-xs font-medium">
              المبلغ المطلوب ({t.currency})
            </label>
            <input
              type="number"
              placeholder="أدخل المبلغ"
              value={withdrawAmount}
              onChange={e => setWithdrawAmount(e.target.value)}
              className="border-border bg-background text-foreground focus:ring-primary/30 w-full rounded-lg border px-3 py-2 text-center text-lg font-bold focus:ring-2 focus:outline-none"
            />
          </div>
          <button
            onClick={handleWithdraw}
            className="bg-primary text-primary-foreground flex w-full items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold"
          >
            <CheckCircle2 className="h-4 w-4" />
            تأكيد طلب السحب
          </button>
          <p className="text-muted-foreground text-center text-[10px]">
            سيتم تحويل المبلغ خلال 24-48 ساعة عمل
          </p>
        </div>
      )}
    </div>
  );
}
