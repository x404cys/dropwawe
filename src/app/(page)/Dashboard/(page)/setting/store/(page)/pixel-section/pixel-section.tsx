'use client';

import { useState } from 'react';
import {
  Plus,
  Trash2,
  Copy,
  Facebook,
  Music2,
  Camera,
  LineChart,
  Activity,
} from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
  readOnly?: boolean;
}

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
  readOnly = false,
}: PixelSectionProps) {
  const { t } = useLanguage();

  const platformInfo = {
    facebook: {
      label: t.store.facebookPixel,
      shortLabel: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-500/10 text-blue-600',
    },
    tiktok: {
      label: t.store.tiktokPixel,
      shortLabel: 'TikTok',
      icon: Music2,
      color: 'text-foreground bg-muted',
    },
    snapchat: {
      label: t.store.snapPixel,
      shortLabel: 'Snapchat',
      icon: Camera,
      color: 'bg-yellow-500/10 text-yellow-600',
    },
    google: {
      label: t.store.googlePixel,
      shortLabel: 'Google',
      icon: LineChart,
      color: 'bg-emerald-500/10 text-emerald-600',
    },
  } satisfies Record<PlatformKey, { label: string; shortLabel: string; icon: any; color: string }>;

  const [newPixel, setNewPixel] = useState<{ platform: PlatformKey; name: string; pixelId: string }>(
    {
      platform: 'facebook',
      name: '',
      pixelId: '',
    }
  );

  const pixels: Pixel[] = [
    facebookPixel
      ? {
          id: 'fb',
          platform: 'facebook',
          name: t.store.facebookPixel,
          pixelId: facebookPixel,
          active: true,
          events: ['PageView'],
        }
      : null,
    googlePixel
      ? {
          id: 'go',
          platform: 'google',
          name: t.store.googlePixel,
          pixelId: googlePixel,
          active: true,
          events: ['page_view'],
        }
      : null,
    tiktokPixel
      ? {
          id: 'tk',
          platform: 'tiktok',
          name: t.store.tiktokPixel,
          pixelId: tiktokPixel,
          active: true,
          events: ['PageView'],
        }
      : null,
    snapPixel
      ? {
          id: 'sn',
          platform: 'snapchat',
          name: t.store.snapPixel,
          pixelId: snapPixel,
          active: true,
          events: ['PAGE_VIEW'],
        }
      : null,
  ].filter(Boolean) as Pixel[];

  const addPixel = () => {
    if (readOnly || !newPixel.pixelId) return;

    switch (newPixel.platform) {
      case 'facebook':
        onFacebookPixelChange(newPixel.pixelId);
        break;
      case 'google':
        onGooglePixelChange(newPixel.pixelId);
        break;
      case 'tiktok':
        onTiktokPixelChange(newPixel.pixelId);
        break;
      case 'snapchat':
        onSnapPixelChange(newPixel.pixelId);
        break;
    }

    setNewPixel({ platform: 'facebook', name: '', pixelId: '' });
    setShowForm(false);
  };

  const deletePixel = (platform: PlatformKey) => {
    if (readOnly) return;
    switch (platform) {
      case 'facebook':
        onFacebookPixelChange('');
        break;
      case 'google':
        onGooglePixelChange('');
        break;
      case 'tiktok':
        onTiktokPixelChange('');
        break;
      case 'snapchat':
        onSnapPixelChange('');
        break;
    }
  };

  const copyId = (id: string) => {
    if (readOnly) return;
    navigator.clipboard.writeText(id);
    toast.success(t.store.codeCopied);
  };

  return (
    <div className="space-y-4">
      {showForm && (
        <div className="bg-card border-border animate-in slide-in-from-top-2 space-y-4 rounded-xl border p-4 shadow-sm">
          <h3 className="text-foreground text-sm font-semibold">{t.store.addNewPixel}</h3>
          <div>
            <label className="text-muted-foreground mb-2 block text-xs">{t.store.platform}</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {(Object.keys(platformInfo) as PlatformKey[]).map(platform => {
                const info = platformInfo[platform];
                const Icon = info.icon;
                const isSelected = newPixel.platform === platform;

                return (
                  <button
                    key={platform}
                    onClick={() => setNewPixel({ ...newPixel, platform })}
                    className={`flex flex-col items-center gap-1.5 rounded-lg border py-3 text-xs font-medium transition-colors ${
                      isSelected
                        ? 'bg-primary/10 text-primary ring-primary border-primary ring-1'
                        : 'bg-card text-foreground border-border hover:border-primary/50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {info.shortLabel}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label className="text-muted-foreground mb-1 block text-xs">
              {t.store.pixelNameOptional}
            </label>
            <Input
              value={newPixel.name}
              onChange={event => setNewPixel({ ...newPixel, name: event.target.value })}
              placeholder={t.store.customNamePlaceholder}
              disabled={readOnly}
            />
          </div>
          <div>
            <label className="text-muted-foreground mb-1 block text-xs">{t.store.pixelId}</label>
            <Input
              value={newPixel.pixelId}
              onChange={event => setNewPixel({ ...newPixel, pixelId: event.target.value })}
              placeholder="1234567890123456"
              dir="ltr"
              disabled={readOnly}
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button onClick={addPixel} size="sm" className="flex-1" disabled={readOnly}>
              <Plus className="mr-1 h-4 w-4" />
              {t.store.addPixel}
            </Button>
            <Button onClick={() => setShowForm(false)} variant="outline" size="sm">
              {t.cancel}
            </Button>
          </div>
        </div>
      )}

      {!showForm && pixels.length === 0 && (
        <div className="bg-primary/5 border-primary/20 rounded-xl border p-4">
          <div className="flex items-start gap-3">
            <Activity className="text-primary mt-0.5 h-5 w-5 flex-shrink-0" />
            <div>
              <p className="text-foreground text-sm font-semibold">{t.store.whatIsPixel}</p>
              <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                {t.store.pixelTrackingDesc}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {pixels.map(pixel => {
          const info = platformInfo[pixel.platform];
          const Icon = info.icon;

          return (
            <div key={pixel.id} className="bg-card border-border rounded-xl border p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl border border-border/50 ${info.color}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-foreground text-sm font-bold">{pixel.name || info.label}</h3>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-muted-foreground font-mono text-[11px]" dir="ltr">
                        {pixel.pixelId}
                      </span>
                      <button
                        onClick={() => copyId(pixel.pixelId)}
                        disabled={readOnly}
                        className="text-muted-foreground hover:text-primary p-1 transition-colors"
                        aria-label={t.store.codeCopied}
                        title={t.store.codeCopied}
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-border mt-4 flex items-center justify-between border-t pt-3">
                <div className="flex flex-wrap gap-1">
                  {pixel.events.map(event => (
                    <span
                      key={event}
                      className="bg-muted text-muted-foreground rounded-full px-2.5 py-0.5 font-mono text-[10px]"
                    >
                      {event}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => deletePixel(pixel.platform)}
                  disabled={readOnly}
                  className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-lg p-2 transition-colors"
                  title={t.store.deletePixel}
                  aria-label={t.store.deletePixel}
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
