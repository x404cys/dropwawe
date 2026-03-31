import type { VisitEntityType, VisitPageType } from '@/lib/visitor-tracking';

export interface OrderItemData {
  quantity: number;
  product: { name: string } | null;
}

export interface OrderData {
  id: string;
  fullName: string | null;
  phone: string | null;
  location: string | null;
  total: number;
  status: string;
  createdAt: Date;
  items: OrderItemData[];
}

export interface VisitorData {
  userAgent: string | null;
  referrer: string | null;
}

export interface CustomerStat {
  name: string;
  phone: string;
  orders: number;
  total: number;
  lastOrder: string;
}

export interface ProductStat {
  name: string;
  sales: number;
  revenue: number;
}

export interface ChartDataPoint {
  day: string;
  value: number;
}

export interface RevenueDataPoint {
  day: string;
  orders: number;
  revenue: number;
}

export interface MonthlyChartPoint {
  day: string;
  revenue: number;
}

export interface GovernorateData {
  name: string;
  orders: number;
  percentage: number;
}

export interface DeviceData {
  name: string;
  value: number;
  color: string;
  icon: string;
}

export interface DeviceBrand {
  name: string;
  percentage: number;
  color: string;
}

export interface TrafficSource {
  name: string;
  value: number;
  color: string;
  emoji: string;
}

export interface VisitLocationStat {
  pageType: VisitPageType;
  visits: number;
  percentage: number;
}

export interface VisitEntityStat {
  entityType: VisitEntityType;
  entityId: string;
  entityName: string;
  visits: number;
  percentage: number;
}

export interface DashboardStats {
  totalRevenue: number;
  availableBalance: number;
  orderCount: number;
  confirmedCount: number;
  pendingCount: number;
  productCount: number;
  visitCount: number;
  uniqueVisitorCount: number;
  customers: CustomerStat[];
  topProducts: ProductStat[];
  revenueChart: RevenueDataPoint[];
  monthlyChart: MonthlyChartPoint[];
  governorateData: GovernorateData[];
  deviceData: DeviceData[];
  deviceBrands: DeviceBrand[];
  trafficSources: TrafficSource[];
  visitLocations: VisitLocationStat[];
  visitEntities: VisitEntityStat[];
  chartData: ChartDataPoint[];
}
