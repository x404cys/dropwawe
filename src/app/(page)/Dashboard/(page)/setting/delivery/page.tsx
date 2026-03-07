'use client';

import { useState } from 'react';
import { Truck, Plus, Trash2, Phone } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '../../../context/LanguageContext';
import SettingsPageHeader from '../_components/settings-page-header';
import SettingsSectionCard from '../_components/settings-section-card';

interface DeliveryCompany {
  id: string;
  name: string;
  emoji: string;
  areas: string[];
  baseFee: number;
  estimatedDays: string;
  active: boolean;
  phone: string;
}

export default function DeliverySettingsPage() {
  const { t } = useLanguage();

  const DEFAULT_COMPANIES: DeliveryCompany[] = [
    {
      id: '1', name: t.deliverySettings?.iraqFastPost || 'بريد العراق السريع', emoji: '🚚',
      areas: [t.deliverySettings?.baghdad || 'بغداد', t.deliverySettings?.basra || 'البصرة', t.deliverySettings?.erbil || 'أربيل'], baseFee: 5000,
      estimatedDays: t.deliverySettings?.oneToThreeDays || '1-3 أيام', active: true, phone: '0770 000 0001',
    },
    {
      id: '2', name: t.deliverySettings?.deliveryPlus || 'توصيل بلس', emoji: '📦',
      areas: [t.deliverySettings?.baghdad || 'بغداد', t.deliverySettings?.najaf || 'النجف', t.deliverySettings?.karbala || 'كربلاء'], baseFee: 3000,
      estimatedDays: t.deliverySettings?.oneToTwoDays || '1-2 يوم', active: true, phone: '0771 000 0002',
    },
    {
      id: '3', name: t.deliverySettings?.fastDelivery || 'سريع للتوصيل', emoji: '⚡',
      areas: [t.deliverySettings?.baghdadOnly || 'بغداد فقط'], baseFee: 2000,
      estimatedDays: t.deliverySettings?.sameDay || 'نفس اليوم', active: false, phone: '0772 000 0003',
    },
  ];

  const [companies, setCompanies] = useState<DeliveryCompany[]>(DEFAULT_COMPANIES);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', baseFee: '', phone: '', estimatedDays: '' });

  const toggle = (id: string) =>
    setCompanies(prev => prev.map(c => (c.id === id ? { ...c, active: !c.active } : c)));

  const addCompany = () => {
    if (!form.name.trim()) return;
    const company: DeliveryCompany = {
      id: Date.now().toString(),
      name: form.name,
      emoji: '🚚',
      areas: [],
      baseFee: Number(form.baseFee) || 0,
      estimatedDays: form.estimatedDays || (t.deliverySettings?.oneToThreeDays || '2-3 أيام'),
      active: true,
      phone: form.phone,
    };
    setCompanies(prev => [company, ...prev]);
    setForm({ name: '', baseFee: '', phone: '', estimatedDays: '' });
    setShowForm(false);
  };

  const deleteCompany = (id: string) =>
    setCompanies(prev => prev.filter(c => c.id !== id));

  const activeCount = companies.filter(c => c.active).length;

  const headerAction = (
    <Button
      size="sm"
      onClick={() => setShowForm(!showForm)}
      className="h-8 gap-1.5 text-xs bg-primary hover:bg-primary/90"
    >
      <Plus className="h-3.5 w-3.5" />
      {t.deliverySettings?.addCompany || 'إضافة شركة'}
    </Button>
  );

  return (
    <section dir="rtl" className="min-h-screen bg-background pb-28">
      <SettingsPageHeader
        title={t.deliverySettings?.title || 'إعدادات التوصيل'}
        subtitle={`${activeCount} ${t.deliverySettings?.activeCompanies || 'شركة نشطة من'} ${companies.length}`}
        action={headerAction}
      />

      <div className="px-4 pt-4 space-y-4 max-w-xl mx-auto">
        {/* Add form */}
        {showForm && (
          <SettingsSectionCard className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">
              {t.deliverySettings?.addDeliveryCompany || 'إضافة شركة توصيل جديدة'}
            </h3>

            <div>
              <label className="text-[11px] text-muted-foreground mb-1 block">
                {t.deliverySettings?.companyName || 'اسم الشركة *'}
              </label>
              <Input
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder={t.deliverySettings?.companyNamePlaceholder || 'اسم شركة التوصيل'}
                className="h-10"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-muted-foreground mb-1 block">
                  {t.deliverySettings?.deliveryFee || 'رسوم التوصيل (د.ع)'}
                </label>
                <Input
                  type="number"
                  value={form.baseFee}
                  onChange={e => setForm({ ...form, baseFee: e.target.value })}
                  placeholder={t.deliverySettings?.deliveryFeePlaceholder || '5000'}
                  className="h-10"
                />
              </div>
              <div>
                <label className="text-[11px] text-muted-foreground mb-1 block">
                  {t.deliverySettings?.deliveryTime || 'مدة التوصيل'}
                </label>
                <Input
                  value={form.estimatedDays}
                  onChange={e => setForm({ ...form, estimatedDays: e.target.value })}
                  placeholder={t.deliverySettings?.deliveryTimePlaceholder || '1-3 أيام'}
                  className="h-10"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-muted-foreground mb-1 block">
                {t.profile?.phone || 'رقم التلفون'}
              </label>
              <Input
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                placeholder="07XX XXX XXXX"
                dir="ltr"
                className="h-10"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <Button onClick={addCompany} size="sm" className="flex-1 bg-primary hover:bg-primary/90">
                {t.add}
              </Button>
              <Button onClick={() => setShowForm(false)} variant="outline" size="sm">
                {t.cancel}
              </Button>
            </div>
          </SettingsSectionCard>
        )}

        {/* Company list */}
        <div className="space-y-3">
          {companies.map(company => (
            <SettingsSectionCard
              key={company.id}
              className={`transition-all ${!company.active ? 'opacity-60' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center text-xl flex-shrink-0 border border-border">
                    {company.emoji}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">{company.name}</h3>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-[11px] text-muted-foreground flex items-center gap-0.5">
                        <Truck className="h-3 w-3" /> {company.estimatedDays}
                      </span>
                      <span className="text-[11px] text-muted-foreground flex items-center gap-0.5">
                        <Phone className="h-3 w-3" /> {company.phone}
                      </span>
                    </div>
                  </div>
                </div>
                <Switch checked={company.active} onCheckedChange={() => toggle(company.id)} />
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                <div className="flex flex-wrap gap-1">
                  {company.areas.length > 0 ? (
                    company.areas.map(area => (
                      <span
                        key={area}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                      >
                        {area}
                      </span>
                    ))
                  ) : (
                    <span className="text-[11px] text-muted-foreground">
                      {t.deliverySettings?.noAreasDefined || 'لا توجد مناطق محددة'}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-primary">
                    {company.baseFee.toLocaleString('ar-IQ')} {t.deliverySettings?.iqd || 'د.ع'}
                  </span>
                  <button
                    onClick={() => deleteCompany(company.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors p-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </SettingsSectionCard>
          ))}
        </div>
      </div>
    </section>
  );
}
