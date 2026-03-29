import { useState, type ElementType } from 'react';
import { BarChart3, Eye, Globe, MapPin, Monitor, Smartphone, Tablet } from 'lucide-react';
import { Cell, Pie, PieChart, Tooltip } from 'recharts';
import type { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { useLanguage } from '../../../context/LanguageContext';
import { DeviceBrand, DeviceData, GovernorateData, TrafficSource } from '../types';

interface AdvancedAnalyticsProps {
  orderCount: number;
  visitCount: number;
  governorateData: GovernorateData[];
  deviceData: DeviceData[];
  deviceBrands: DeviceBrand[];
  trafficSources: TrafficSource[];
}

const DEVICE_ICON_MAP: Record<string, ElementType> = {
  Smartphone,
  Monitor,
  Tablet,
};

const formatTooltipPercentage = (value: ValueType | undefined, name: NameType | undefined) => {
  const normalizedValue = Array.isArray(value) ? value[0] : value;
  const percentage =
    typeof normalizedValue === 'number' ? normalizedValue : Number(normalizedValue) || 0;

  return [`${percentage}%`, typeof name === 'string' ? name : ''] as const;
};

export function AdvancedAnalytics({
  orderCount,
  visitCount,
  governorateData,
  deviceData,
  deviceBrands,
  trafficSources,
}: AdvancedAnalyticsProps) {
  const { lang, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'governorate' | 'device' | 'pages' | 'sources'>(
    'governorate'
  );

  const locale = lang === 'en' ? 'en-US' : lang === 'ku' ? 'ckb-IQ' : 'ar-IQ';

  const analyticsTabs = [
    { id: 'governorate' as const, label: t.stats.governorates, icon: MapPin },
    { id: 'device' as const, label: t.stats.devices, icon: Smartphone },
    { id: 'pages' as const, label: t.stats.visits, icon: Eye },
    { id: 'sources' as const, label: t.stats.sources, icon: Globe },
  ];

  const chartDeviceData = deviceData.map(device => ({
    name: device.name,
    value: device.value,
    color: device.color,
  }));

  return (
    <div className="pt-2">
      <div className="mb-4 flex items-center gap-2">
        <BarChart3 className="text-primary h-5 w-5" />
        <h2 className="text-foreground text-base font-bold">{t.stats.advancedAnalytics}</h2>
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
                <h3 className="text-foreground text-sm font-semibold">
                  {t.stats.ordersByGovernorate}
                </h3>
                <p className="text-muted-foreground mt-0.5 text-[11px]">
                  {t.stats.geographicDistribution}
                </p>
              </div>
              <div className="bg-primary/10 rounded-lg px-2.5 py-1">
                <span className="text-primary text-[11px] font-bold">
                  {orderCount.toLocaleString(locale)} {t.stats.ordersUnit}
                </span>
              </div>
            </div>
          </div>
          <div className="space-y-2.5 p-4">
            {governorateData.length === 0 ? (
              <p className="text-muted-foreground py-4 text-center text-xs">
                {t.stats.noOrdersYet}
              </p>
            ) : (
              governorateData.map((governorate, index) => (
                <div key={governorate.name}>
                  <div className="mb-1 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-md text-[10px] font-bold ${
                          index === 0
                            ? 'bg-primary/10 text-primary'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {index + 1}
                      </span>
                      <span className="text-foreground text-xs font-medium">
                        {governorate.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-[11px]">
                        {governorate.orders.toLocaleString(locale)} {t.stats.ordersUnit}
                      </span>
                      <span className="text-foreground w-8 text-left text-[11px] font-bold">
                        {governorate.percentage}%
                      </span>
                    </div>
                  </div>
                  <div className="bg-muted h-1.5 overflow-hidden rounded-full">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        index === 0 ? 'bg-primary' : index === 1 ? 'bg-primary/70' : 'bg-primary/40'
                      }`}
                      style={{ width: `${governorate.percentage}%` }}
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
            <h3 className="text-foreground text-sm font-semibold">{t.stats.deviceTypes}</h3>
            <p className="text-muted-foreground mt-0.5 text-[11px]">
              {t.stats.deviceUsageSubtitle}
            </p>
          </div>
          <div className="p-4">
            <div className="mb-5 flex items-center justify-center">
              <div className="relative h-[200px] w-[200px]">
                <PieChart width={200} height={200}>
                  <Pie
                    data={chartDeviceData}
                    cx={100}
                    cy={100}
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {chartDeviceData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ fontSize: 11, borderRadius: 8 }}
                    formatter={formatTooltipPercentage}
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
              <p className="text-muted-foreground py-2 text-center text-xs">{t.stats.noDataYet}</p>
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
                  {t.stats.systemsAndBrands}
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
                <h3 className="text-foreground text-sm font-semibold">{t.stats.storeVisits}</h3>
                <p className="text-muted-foreground mt-0.5 text-[11px]">
                  {t.stats.totalStoreVisits}
                </p>
              </div>
              <div className="rounded-lg bg-green-500/10 px-2.5 py-1">
                <span className="text-[11px] font-bold text-green-600">
                  {visitCount.toLocaleString(locale)} {t.stats.visitsUnit}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 p-6">
            <Eye className="text-primary h-10 w-10 opacity-70" />
            <p className="text-foreground text-2xl font-extrabold">
              {visitCount.toLocaleString(locale)}
            </p>
            <p className="text-muted-foreground text-xs">{t.stats.totalVisits}</p>
            <p className="text-muted-foreground mt-1 text-[11px]">
              {Math.round(visitCount * 0.75).toLocaleString(locale)}{' '}
              {t.stats.approximateUniqueVisitors}
            </p>
          </div>
        </div>
      )}

      {activeTab === 'sources' && (
        <div className="bg-card border-border overflow-hidden rounded-2xl border">
          <div className="border-border border-b p-4 pb-3">
            <h3 className="text-foreground text-sm font-semibold">{t.stats.trafficSources}</h3>
            <p className="text-muted-foreground mt-0.5 text-[11px]">{t.stats.customerSources}</p>
          </div>
          {trafficSources.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center text-xs">{t.stats.noDataYet}</p>
          ) : (
            <>
              <div className="flex items-center justify-center py-4">
                <PieChart width={200} height={200}>
                  <Pie
                    data={trafficSources.map(source => ({
                      name: source.name,
                      value: source.value,
                      color: source.color,
                    }))}
                    cx={100}
                    cy={100}
                    innerRadius={50}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {trafficSources.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ fontSize: 11, borderRadius: 8 }}
                    formatter={formatTooltipPercentage}
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
