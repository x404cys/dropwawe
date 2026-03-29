import { BarChart3, Users } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';

interface MainTabsProps {
  mainTab: 'stats' | 'customers';
  setMainTab: (tab: 'stats' | 'customers') => void;
}

export function MainTabs({ mainTab, setMainTab }: MainTabsProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-muted/50 flex gap-1 rounded-xl p-1">
      <button
        onClick={() => setMainTab('stats')}
        className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-semibold transition-all ${
          mainTab === 'stats' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
        }`}
      >
        <BarChart3 className="h-3.5 w-3.5" />
        {t.stats.title}
      </button>
      <button
        onClick={() => setMainTab('customers')}
        className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-semibold transition-all ${
          mainTab === 'customers' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
        }`}
      >
        <Users className="h-3.5 w-3.5" />
        {t.customers.title}
      </button>
    </div>
  );
}
