export interface Customer {
  name: string;
  phone: string;
  orders: number;
  total: number;
  lastOrder: string;
}

export interface TopProduct {
  name: string;
  sales: number;
  revenue: number;
}

export interface RevenueChartItem {
  day: string;
  orders: number;
  revenue: number;
}

export interface MonthlyChartItem {
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

export interface StatsResponse {
  totalRevenue: number;
  availableBalance: number;
  orderCount: number;
  confirmedCount: number;
  pendingCount: number;
  productCount: number;
  visitCount: number;
  customers: Customer[];
  topProducts: TopProduct[];
  revenueChart: RevenueChartItem[];
  monthlyChart: MonthlyChartItem[];
  governorateData: GovernorateData[];
  deviceData: DeviceData[];
  deviceBrands: DeviceBrand[];
  trafficSources: TrafficSource[];
}
