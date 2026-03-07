'use client';

import { useState } from 'react';
import { Plus, Trash2, Copy, Facebook, Music2, Camera, LineChart, Activity } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { useLanguage } from '../../../../../context/LanguageContext';

type PlatformKey = 'facebook' | 'tiktok' | 'snapchat' | 'google';

interface Pixel {
  id: string;
  name: string;
  platform: PlatformKey;
  pixelId: string;
  active: boolean;
  events: string[];
}

interface PixelSectionProps {
  facebookPixel: string | null;
  googlePixel: string | null;
  tiktokPixel: string | null;
  snapPixel: string | null;
  onFacebookPixelChange: (value: string | null) => void;
  onGooglePixelChange: (value: string | null) => void;
  onTiktokPixelChange: (value: string | null) => void;
  onSnapPixelChange: (value: string | null) => void;
  showForm: boolean;
  setShowForm: (show: boolean) => void;
}

const PLATFORM_INFO: Record<PlatformKey, { label: string; icon: any; color: string }> = {
  facebook: { label: 'فيسبوك بيكسل', icon: Facebook, color: 'bg-blue-500/10 text-blue-600' },
  tiktok: { label: 'تيك توك بيكسل', icon: Music2, color: 'text-foreground bg-muted' },
  snapchat: { label: 'سناب شات بيكسل', icon: Camera, color: 'bg-yellow-500/10 text-yellow-600' },
  google: { label: 'Google Analytics', icon: LineChart, color: 'bg-emerald-500/10 text-emerald-600' },
};

export default function PixelSection({
  facebookPixel,
  googlePixel,
  tiktokPixel,
  snapPixel,
  onFacebookPixelChange,
  onGooglePixelChange,
  onTiktokPixelChange,
  onSnapPixelChange,
  showForm,
  setShowForm,
}: PixelSectionProps) {
  const { t } = useLanguage();

  const [newPixel, setNewPixel] = useState<{ platform: PlatformKey; name: string; pixelId: string }>({
    platform: 'facebook',
    name: '',
    pixelId: '',
  });

  const pixels: Pixel[] = [
    facebookPixel ? { id: 'fb', platform: 'facebook', name: 'Facebook Pixel', pixelId: facebookPixel, active: true, events: ['PageView'] } : null,
    googlePixel ? { id: 'go', platform: 'google', name: 'Google Analytics', pixelId: googlePixel, active: true, events: ['page_view'] } : null,
    tiktokPixel ? { id: 'tk', platform: 'tiktok', name: 'TikTok Pixel', pixelId: tiktokPixel, active: true, events: ['PageView'] } : null,
    snapPixel ? { id: 'sn', platform: 'snapchat', name: 'Snap Pixel', pixelId: snapPixel, active: true, events: ['PAGE_VIEW'] } : null,
  ].filter(Boolean) as Pixel[];

  const addPixel = () => {
    if (!newPixel.pixelId) return;

    // We only support one pixel per platform in the current backend. Adding another overwrites it.
    switch (newPixel.platform) {
      case 'facebook': onFacebookPixelChange(newPixel.pixelId); break;
      case 'google': onGooglePixelChange(newPixel.pixelId); break;
      case 'tiktok': onTiktokPixelChange(newPixel.pixelId); break;
      case 'snapchat': onSnapPixelChange(newPixel.pixelId); break;
    }

    setNewPixel({ platform: 'facebook', name: '', pixelId: '' });
    setShowForm(false);
  };

  const deletePixel = (platform: PlatformKey) => {
    switch (platform) {
      case 'facebook': onFacebookPixelChange(''); break;
      case 'google': onGooglePixelChange(''); break;
      case 'tiktok': onTiktokPixelChange(''); break;
      case 'snapchat': onSnapPixelChange(''); break;
    }
  };

  const copyId = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success('تم النسخ');
  };

  return (
    <div className="space-y-4">
      {showForm && (
        <div className="bg-card border border-border rounded-xl p-4 space-y-4 shadow-sm animate-in slide-in-from-top-2">
          <h3 className="text-sm font-semibold text-foreground">إضافة بيكسل جديد</h3>
          <div>
            <label className="text-xs text-muted-foreground mb-2 block">المنصة</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(Object.keys(PLATFORM_INFO) as PlatformKey[]).map((platform) => {
                const info = PLATFORM_INFO[platform];
                const Icon = info.icon;
                const isSelected = newPixel.platform === platform;
                return (
                  <button
                    key={platform}
                    onClick={() => setNewPixel({ ...newPixel, platform })}
                    className={`flex flex-col items-center gap-1.5 py-3 rounded-lg text-xs font-medium border transition-colors ${
                      isSelected
                        ? 'bg-primary/10 text-primary border-primary ring-1 ring-primary'
                        : 'bg-card text-foreground border-border hover:border-primary/50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {info.label.split(' ')[0]}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">الاسم (اختياري)</label>
            <Input
              value={newPixel.name}
              onChange={(e) => setNewPixel({ ...newPixel, name: e.target.value })}
              placeholder="اسم مخصص"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">معرّف البيكسل</label>
            <Input
              value={newPixel.pixelId}
              onChange={(e) => setNewPixel({ ...newPixel, pixelId: e.target.value })}
              placeholder="1234567890123456"
              dir="ltr"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button onClick={addPixel} size="sm" className="flex-1">
              إضافة
            </Button>
            <Button onClick={() => setShowForm(false)} variant="outline" size="sm">
              إلغاء
            </Button>
          </div>
        </div>
      )}

      {!showForm && pixels.length === 0 && (
         <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
         <div className="flex items-start gap-3">
           <Activity className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
           <div>
             <p className="text-sm font-semibold text-foreground">ما هو البيكسل؟</p>
             <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
               البيكسل هو كود تتبع يُضاف لمتجرك لمعرفة سلوك الزوار وقياس فعالية الإعلانات وتتبع عمليات الشراء لزيادة المبيعات وتحسين استهدافك.
             </p>
           </div>
         </div>
       </div>
      )}

      <div className="space-y-3">
        {pixels.map((pixel) => {
          const info = PLATFORM_INFO[pixel.platform];
          const Icon = info.icon;
          return (
            <div key={pixel.id} className="bg-card border border-border rounded-xl p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center border border-border/50 ${info.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">{pixel.name || info.label}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] text-muted-foreground font-mono" dir="ltr">
                        {pixel.pixelId}
                      </span>
                      <button
                        onClick={() => copyId(pixel.pixelId)}
                        className="text-muted-foreground hover:text-primary transition-colors p-1"
                        aria-label="نسخ الكود"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
                <Switch checked={pixel.active} />
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                <div className="flex flex-wrap gap-1">
                  {pixel.events.map((event) => (
                    <span
                      key={event}
                      className="text-[10px] px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground font-mono"
                    >
                      {event}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => deletePixel(pixel.platform)}
                  className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors p-2 rounded-lg"
                  title="حذف البيكسل"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
