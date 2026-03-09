import { BarChart3 } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';

interface PageHeaderProps {
  mainTab: 'stats' | 'customers';
  customersCount: number;
}

export function PageHeader({ mainTab, customersCount }: PageHeaderProps) {
  const { t } = useLanguage();

  return (
    <div className="flex items-center justify-between px-1 pt-1">
      <div>
        <h1 className="text-foreground text-xl font-bold">
          {mainTab === 'stats' ? t.stats?.title || 'الإحصائيات' : t.customers?.title || 'العملاء'}
        </h1>
        <p className="text-muted-foreground mt-0.5 text-xs">
          {mainTab === 'stats'
            ? t.more?.statsDesc || 'تقارير المبيعات والأداء'
            : `${customersCount} ${t.customers?.customer || 'عميل'}`}
        </p>
      </div>
      <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-xl">
        <BarChart3 className="text-primary h-5 w-5" />
      </div>
    </div>
  );
}
