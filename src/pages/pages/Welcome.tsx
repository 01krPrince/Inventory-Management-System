import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Wallet,
  AlertTriangle,
  PackageX,
  Clock,
  CheckCircle2,
  TrendingUp,
  Calendar,
  LucideIcon,
  Laptop,
  Shirt,
  Armchair,
  Watch,
  MoreHorizontal,
} from "lucide-react";
import { COLORS } from "../../constants/colors";
// --- MOCK DATA ---

// 1. Sales Trend
const salesData = [
  { name: "Mon", sales: 4000, profit: 2400 },
  { name: "Tue", sales: 3000, profit: 1398 },
  { name: "Wed", sales: 9800, profit: 5800 },
  { name: "Thu", sales: 3908, profit: 2000 },
  { name: "Fri", sales: 4800, profit: 1800 },
  { name: "Sat", sales: 3800, profit: 2390 },
  { name: "Sun", sales: 4300, profit: 2500 },
];

// 2. Dead Stock
const deadStockData = [
  {
    name: "Winter Jacket (XL)",
    lastSold: "120 days ago",
    stock: 15,
    value: "$1,200",
  },
  {
    name: "Old Gen Keyboards",
    lastSold: "200 days ago",
    stock: 45,
    value: "$450",
  },
  { name: "Red Scarf", lastSold: "95 days ago", stock: 8, value: "$80" },
];

// 3. Alerts
const alerts = [
  {
    type: "critical",
    msg: "3 Items Out of Stock",
    sub: "Samsung A14, USB Cable...",
  },
  {
    type: "warning",
    msg: "Purchase Order #PO-902",
    sub: "Pending Admin Approval",
  },
  {
    type: "warning",
    msg: "Payment Overdue",
    sub: "Client: Rahul Traders (₹12,000)",
  },
];

// 4. NEW: Advanced Category Data
const categoryData = [
  {
    name: "Electronics",
    value: 45000,
    growth: "+12.5%",
    units: 320,
    color: "#3B82F6",
    icon: Laptop,
  },
  {
    name: "Men's Wear",
    value: 28000,
    growth: "+8.2%",
    units: 540,
    color: "#8B5CF6",
    icon: Shirt,
  },
  {
    name: "Home Decor",
    value: 15200,
    growth: "-2.4%",
    units: 110,
    color: "#10B981",
    icon: Armchair,
  },
  {
    name: "Accessories",
    value: 8900,
    growth: "+15.0%",
    units: 850,
    color: "#F59E0B",
    icon: Watch,
  },
];

// --- HELPER COMPONENTS ---

interface KpiCardProps {
  title: string;
  value: string;
  trend: string;
  trendUp: boolean;
  icon: LucideIcon;
  color: "blue" | "green" | "orange" | "purple";
  sub: string;
}

const KpiCard = ({
  title,
  value,
  trend,
  trendUp,
  icon: Icon,
  color,
  sub,
}: KpiCardProps) => {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    green:
      "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400",
    orange:
      "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
    purple:
      "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-800 transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className={`rounded-lg p-3 ${colorMap[color]}`}>
          <Icon size={24} />
        </div>
        <div
          className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
            trendUp ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {trend}
          {trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
        </div>
      </div>
      <div className="mt-4">
        <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
          {value}
        </h4>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <span className="text-xs text-gray-400">• {sub}</span>
        </div>
      </div>
    </div>
  );
};

// --- MAIN DASHBOARD ---

export default function AdminDashboard() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="space-y-6 pb-10">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            Welcome back, Admin. Here is today's snapshot.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300">
            <Calendar size={16} />
            <span>Today: Dec 30</span>
          </button>
          <button
            className="px-4 py-2 text-white text-sm font-medium rounded-lg shadow-sm"
            style={{ backgroundColor: COLORS.primary }}
          >
            + New Invoice
          </button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Total Sales"
          value="₹ 1,24,500"
          trend="+12%"
          trendUp={true}
          icon={TrendingUp}
          color="blue"
          sub="vs. yesterday"
        />
        <KpiCard
          title="Net Profit"
          value="₹ 42,000"
          trend="+8%"
          trendUp={true}
          icon={DollarSign}
          color="green"
          sub="Real-time margin"
        />
        <KpiCard
          title="To Collect (Due)"
          value="₹ 18,300"
          trend="-2%"
          trendUp={false}
          icon={Wallet}
          color="orange"
          sub="From 3 Clients"
        />
        <KpiCard
          title="New Orders"
          value="14"
          trend="+4"
          trendUp={true}
          icon={CheckCircle2}
          color="purple"
          sub="Pending processing"
        />
      </div>

      {/* MAIN CHART & ALERTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Chart */}
        <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Revenue vs Profit
              </h3>
              <p className="text-xs text-gray-500">Last 7 Days Performance</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-xs text-gray-500">Sales</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-xs text-gray-500">Profit</span>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E5E7EB"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6B7280" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6B7280" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorSales)"
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  stroke="#10B981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorProfit)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Alerts */}
        <div className="rounded-xl border border-gray-200 bg-white p-0 shadow-sm overflow-hidden dark:border-gray-800 dark:bg-gray-800 flex flex-col">
          <div className="p-4 border-b border-gray-100 bg-red-50/50 dark:border-gray-700 dark:bg-red-900/10">
            <h3 className="text-lg font-bold text-red-700 dark:text-red-400 flex items-center gap-2">
              <AlertTriangle size={20} /> Action Required
            </h3>
          </div>
          <div className="p-4 space-y-4 flex-1 overflow-y-auto">
            {alerts.map((alert, idx) => (
              <div
                key={idx}
                className="flex gap-3 items-start pb-4 border-b border-dashed border-gray-100 last:border-0 dark:border-gray-700"
              >
                <div
                  className={`mt-1 size-2 rounded-full shrink-0 ${
                    alert.type === "critical"
                      ? "bg-red-500 animate-pulse"
                      : "bg-orange-400"
                  }`}
                />
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {alert.msg}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{alert.sub}</p>
                  <button className="text-xs font-medium text-blue-600 mt-2 hover:underline">
                    Resolve Now &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 bg-gray-50 border-t border-gray-100 text-center dark:bg-gray-800 dark:border-gray-700">
            <button className="text-xs text-gray-500 hover:text-gray-800">
              View All Notifications
            </button>
          </div>
        </div>
      </div>

      {/* --- SECTION 3: BOTTOM TABLES --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. DEAD STOCK (Same as before) */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
              <PackageX size={18} className="text-gray-400" /> Dead Stock
            </h3>
            <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded">
              Blocked Capital
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-3 py-2">Item</th>
                  <th className="px-3 py-2">Last Sold</th>
                  <th className="px-3 py-2 text-right">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {deadStockData.map((item, idx) => (
                  <tr key={idx}>
                    <td className="px-3 py-3 font-medium text-gray-800 dark:text-gray-200">
                      {item.name}
                    </td>
                    <td className="px-3 py-3 text-red-500 flex items-center gap-1">
                      <Clock size={12} /> {item.lastSold}
                    </td>
                    <td className="px-3 py-3 text-right font-bold text-gray-800 dark:text-white">
                      {item.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2. TOP PERFORMING CATEGORIES (IMPROVED) */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Top Categories
              </h3>
              <p className="text-xs text-gray-500">By Revenue & Volume</p>
            </div>
            <button className="p-1 hover:bg-gray-100 rounded text-gray-500">
              <MoreHorizontal size={18} />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 h-full">
            {/* A: Donut Chart (Visual) */}
            <div className="h-[200px] w-full sm:w-1/3 flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                    onMouseEnter={(_, index) => setActiveIndex(index)}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        strokeWidth={0}
                        opacity={activeIndex === index ? 1 : 0.8}
                        className="transition-all duration-300 cursor-pointer"
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              {/* Center Text overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs text-gray-400">Total</span>
                <span className="text-lg font-bold text-gray-800 dark:text-white">
                  97k
                </span>
              </div>
            </div>

            {/* B: Detailed List (Data) */}
            <div className="flex-1 space-y-4 overflow-y-auto pr-2">
              {categoryData.map((cat, idx) => {
                const Icon = cat.icon;
                const isPositive = cat.growth.startsWith("+");

                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-50 hover:border-gray-100 hover:bg-gray-50 transition-colors dark:border-gray-700/50 dark:hover:bg-gray-700/50 cursor-pointer"
                    onMouseEnter={() => setActiveIndex(idx)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="p-2 rounded-md bg-opacity-10"
                        style={{
                          backgroundColor: `${cat.color}20`,
                          color: cat.color,
                        }}
                      >
                        <Icon size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800 dark:text-white">
                          {cat.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {cat.units} units sold
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        ₹ {(cat.value / 1000).toFixed(1)}k
                      </p>
                      <p
                        className={`text-xs font-medium flex items-center justify-end gap-1 ${
                          isPositive ? "text-green-600" : "text-red-500"
                        }`}
                      >
                        {isPositive ? (
                          <ArrowUpRight size={10} />
                        ) : (
                          <ArrowDownRight size={10} />
                        )}
                        {cat.growth}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
