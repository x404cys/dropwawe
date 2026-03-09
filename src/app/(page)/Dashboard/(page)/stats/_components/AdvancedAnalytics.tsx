import { useState } from 'react';
import { BarChart3, MapPin, Smartphone, Eye, Globe, Monitor, Tablet } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { GovernorateData, DeviceData, DeviceBrand, TrafficSource } from '../types';

interface AdvancedAnalyticsProps {
  orderCount: number;
  visitCount: number;
  governorateData: GovernorateData[];
  deviceData: DeviceData[];
  deviceBrands: DeviceBrand[];
  trafficSources: TrafficSource[];
}

const DEVICE_ICON_MAP: Record<string, React.ElementType> = {
  Smartphone,
  Monitor,
  Tablet,
};

export function AdvancedAnalytics({
  orderCount,
  visitCount,
  governorateData,
  deviceData,
  deviceBrands,
  trafficSources,
}: AdvancedAnalyticsProps) {
  const [activeTab, setActiveTab] = useState<'governorate' | 'device' | 'pages' | 'sources'>(
    'governorate'
  );

  const analyticsTabs = [
    { id: 'governorate' as const, label: 'المحافظات', icon: MapPin },
    { id: 'device' as const, label: 'الأجهزة', icon: Smartphone },
    { id: 'pages' as const, label: 'الزيارات', icon: Eye },
    { id: 'sources' as const, label: 'المصادر', icon: Globe },
  ];

  return (
    <div className="pt-2">
      <div className="mb-4 flex items-center gap-2">
        <BarChart3 className="text-primary h-5 w-5" />
        <h2 className="text-foreground text-base font-bold">تحليلات متقدمة</h2>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-3">
        {analyticsTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-card border-border text-muted-foreground hover:text-foreground border'
            }`}
          >
            <tab.icon className="h-3.5 w-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'governorate' && (
        <div className="bg-card border-border overflow-hidden rounded-2xl border">
          <div className="border-border border-b p-4 pb-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-foreground text-sm font-semibold">الطلبات حسب المحافظة</h3>
                <p className="text-muted-foreground mt-0.5 text-[11px]">توزيع الطلبات الجغرافي</p>
              </div>
              <div className="bg-primary/10 rounded-lg px-2.5 py-1">
                <span className="text-primary text-[11px] font-bold">{orderCount} طلب</span>
              </div>
            </div>
          </div>
          <div className="space-y-2.5 p-4">
            {governorateData.length === 0 ? (
              <p className="text-muted-foreground py-4 text-center text-xs">لا توجد طلبات بعد</p>
            ) : (
              governorateData.map((gov, i) => (
                <div key={gov.name}>
                  <div className="mb-1 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-md text-[10px] font-bold ${
                          i === 0 ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {i + 1}
                      </span>
                      <span className="text-foreground text-xs font-medium">{gov.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-[11px]">{gov.orders} طلب</span>
                      <span className="text-foreground w-8 text-left text-[11px] font-bold">
                        {gov.percentage}%
                      </span>
                    </div>
                  </div>
                  <div className="bg-muted h-1.5 overflow-hidden rounded-full">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        i === 0 ? 'bg-primary' : i === 1 ? 'bg-primary/70' : 'bg-primary/40'
                      }`}
                      style={{ width: `${gov.percentage}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'device' && (
        <div className="bg-card border-border overflow-hidden rounded-2xl border">
          <div className="border-border border-b p-4 pb-3">
            <h3 className="text-foreground text-sm font-semibold">نوع الأجهزة</h3>
            <p className="text-muted-foreground mt-0.5 text-[11px]">
              الأجهزة المستخدمة لتصفح المتجر
            </p>
          </div>
          <div className="p-4">
            <div className="mb-5 flex items-center justify-center">
              <div className="relative h-[200px] w-[200px]">
                <PieChart width={200} height={200}>
                  <Pie
                    data={deviceData.map(d => ({ name: d.name, value: d.value, color: d.color }))}
                    cx={100}
                    cy={100}
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {deviceData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ fontSize: 11, borderRadius: 8 }}
                    formatter={(v: any, n: any) => [`${v}%`, n ?? '']}
                  />
                </PieChart>
                {deviceData[0] && (
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <Smartphone className="text-primary mb-0.5 h-5 w-5" />
                    <span className="text-foreground text-xl font-bold">
                      {deviceData[0].value}%
                    </span>
                    <span className="text-muted-foreground text-[10px]">{deviceData[0].name}</span>
                  </div>
                )}
              </div>
            </div>
            {deviceData.length === 0 ? (
              <p className="text-muted-foreground py-2 text-center text-xs">لا توجد بيانات بعد</p>
            ) : (
              <div className="space-y-3">
                {deviceData.map(device => {
                  const Icon = DEVICE_ICON_MAP[device.icon] ?? Smartphone;
                  return (
                    <div
                      key={device.name}
                      className="bg-muted/30 flex items-center gap-3 rounded-xl p-3"
                    >
                      <div
                        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg"
                        style={{ backgroundColor: `${device.color}15` }}
                      >
                        <Icon className="h-4 w-4" style={{ color: device.color }} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-foreground text-xs font-medium">{device.name}</span>
                          <span className="text-foreground text-xs font-bold">{device.value}%</span>
                        </div>
                        <div className="bg-muted h-1.5 overflow-hidden rounded-full">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${device.value}%`, backgroundColor: device.color }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {deviceBrands.length > 0 && (
              <div className="border-border mt-5 border-t pt-4">
                <h4 className="text-foreground mb-3 text-xs font-semibold">
                  الأنظمة والعلامات التجارية
                </h4>
                <div className="space-y-2.5">
                  {deviceBrands.map(brand => (
                    <div key={brand.name} className="flex items-center gap-3">
                      <span className="text-foreground w-20 flex-shrink-0 truncate text-xs font-medium">
                        {brand.name}
                      </span>
                      <div className="bg-muted h-2 flex-1 overflow-hidden rounded-full">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${brand.percentage}%`, backgroundColor: brand.color }}
                        />
                      </div>
                      <span className="text-foreground w-8 flex-shrink-0 text-left text-[11px] font-bold">
                        {brand.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'pages' && (
        <div className="bg-card border-border overflow-hidden rounded-2xl border">
          <div className="border-border border-b p-4 pb-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-foreground text-sm font-semibold">زيارات المتجر</h3>
                <p className="text-muted-foreground mt-0.5 text-[11px]">إجمالي زيارات متجرك</p>
              </div>
              <div className="rounded-lg bg-green-500/10 px-2.5 py-1">
                <span className="text-[11px] font-bold text-green-600">
                  {visitCount.toLocaleString('ar-IQ')} زيارة
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 p-6">
            <Eye className="text-primary h-10 w-10 opacity-70" />
            <p className="text-foreground text-2xl font-extrabold">
              {visitCount.toLocaleString('ar-IQ')}
            </p>
            <p className="text-muted-foreground text-xs">إجمالي الزيارات</p>
            <p className="text-muted-foreground mt-1 text-[11px]">
              {Math.round(visitCount * 0.75).toLocaleString('ar-IQ')} زائر فريد تقريباً
            </p>
          </div>
        </div>
      )}

      {activeTab === 'sources' && (
        <div className="bg-card border-border overflow-hidden rounded-2xl border">
          <div className="border-border border-b p-4 pb-3">
            <h3 className="text-foreground text-sm font-semibold">مصادر الزيارات</h3>
            <p className="text-muted-foreground mt-0.5 text-[11px]">من أين يأتي زبائنك</p>
          </div>
          {trafficSources.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center text-xs">لا توجد بيانات بعد</p>
          ) : (
            <>
              <div className="flex items-center justify-center py-4">
                <PieChart width={200} height={200}>
                  <Pie
                    data={trafficSources}
                    cx={100}
                    cy={100}
                    innerRadius={50}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {trafficSources.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ fontSize: 11, borderRadius: 8 }}
                    formatter={(v: any, n: any) => [
                      `${typeof v === 'number' ? v : Number(v) || 0}%`,
                      n ?? '',
                    ]}
                  />
                </PieChart>
              </div>
              <div className="space-y-2 px-4 pb-4">
                {trafficSources.map(source => (
                  <div
                    key={source.name}
                    className="bg-muted/30 flex items-center gap-3 rounded-xl p-3"
                  >
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-lg"
                      style={{ backgroundColor: `${source.color}12` }}
                    >
                      {source.emoji}
                    </div>
                    <div className="flex-1">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-foreground text-xs font-medium">{source.name}</span>
                        <span className="text-foreground text-xs font-bold">{source.value}%</span>
                      </div>
                      <div className="bg-muted h-1.5 overflow-hidden rounded-full">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${source.value}%`, backgroundColor: source.color }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
