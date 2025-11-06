// components/custom/Charts.tsx
'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const lineData = [
  { name: 'يناير', users: 8000 },
  { name: 'فبراير', users: 9600 },
  { name: 'مارس', users: 11200 },
  { name: 'أبريل', users: 18000 },
  { name: 'مايو', users: 16000 },
  { name: 'يونيو', users: 22000 },
  { name: 'يوليو', users: 26500 },
];

const barData = [
  { name: 'Linux', value: 24 },
  { name: 'Mac', value: 18 },
  { name: 'iOS', value: 22 },
  { name: 'Windows', value: 26 },
  { name: 'Android', value: 20 },
];

const pieData = [
  { name: 'الولايات المتحدة', value: 38.4 },
  { name: 'كندا', value: 22.5 },
  { name: 'المكسيك', value: 30.8 },
  { name: 'أخرى', value: 8.1 },
];

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

export function ResponsiveLineChart() {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={lineData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="users" stroke="#4f46e5" strokeWidth={3} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function ResponsiveBarChart() {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={barData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#10b981" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function DoughnutChart() {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={pieData}
          dataKey="value"
          nameKey="name"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={3}
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
