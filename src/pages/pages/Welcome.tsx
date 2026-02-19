import { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
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
  RefreshCw,
  ShoppingCart,
  Boxes,
} from 'lucide-react';
import { COLORS } from '../../constants/colors';

// ── DATA ──────────────────────────────────────────────────
const salesData = [
  { name: 'Mon', sales: 41000, profit: 24000, orders: 18 },
  { name: 'Tue', sales: 30000, profit: 13980, orders: 12 },
  { name: 'Wed', sales: 98000, profit: 58000, orders: 41 },
  { name: 'Thu', sales: 39080, profit: 20000, orders: 22 },
  { name: 'Fri', sales: 48000, profit: 18000, orders: 29 },
  { name: 'Sat', sales: 38000, profit: 23900, orders: 24 },
  { name: 'Sun', sales: 43000, profit: 25000, orders: 19 },
];

const weeklyOrders = [
  { day: 'Mon', orders: 18 },
  { day: 'Tue', orders: 12 },
  { day: 'Wed', orders: 41 },
  { day: 'Thu', orders: 22 },
  { day: 'Fri', orders: 29 },
  { day: 'Sat', orders: 24 },
  { day: 'Sun', orders: 19 },
];

const deadStockData = [
  { name: 'Winter Jacket (XL)', lastSold: '120 days', stock: 15, value: 1200, risk: 'high' },
  { name: 'Old Gen Keyboards', lastSold: '200 days', stock: 45, value: 450, risk: 'critical' },
  { name: 'Red Scarf', lastSold: '95 days', stock: 8, value: 80, risk: 'medium' },
  { name: 'Bluetooth Headset v1', lastSold: '160 days', stock: 22, value: 880, risk: 'high' },
];

const alerts = [
  { type: 'critical', msg: '3 Items Out of Stock', sub: 'Samsung A14, USB Cable, Type-C Hub' },
  { type: 'warning', msg: 'Purchase Order #PO-902', sub: 'Pending Admin Approval since Dec 28' },
  { type: 'warning', msg: 'Payment Overdue', sub: 'Client: Rahul Traders — ₹12,000' },
  { type: 'info', msg: 'New Supplier Offer', sub: 'Tech World: 15% off on bulk orders' },
];

const categoryData = [
  { name: 'Electronics', value: 45000, growth: '+12.5', units: 320, color: COLORS.primary, icon: Laptop },
  { name: "Men's Wear", value: 28000, growth: '+8.2', units: 540, color: '#7c3aed', icon: Shirt },
  { name: 'Home Decor', value: 15200, growth: '-2.4', units: 110, color: COLORS.success, icon: Armchair },
  { name: 'Accessories', value: 8900, growth: '+15.0', units: 850, color: COLORS.warning, icon: Watch },
];

const topProducts = [
  { rank: 1, name: 'Samsung A14 5G', sku: 'EL-2201', sold: 142, revenue: 63900, trend: '+18%' },
  { rank: 2, name: 'Nike Air Joggers', sku: 'MW-0432', sold: 118, revenue: 23600, trend: '+9%' },
  { rank: 3, name: 'LED Study Lamp', sku: 'HD-1109', sold: 95, revenue: 9025, trend: '+22%' },
  { rank: 4, name: 'Wireless Earbuds Pro', sku: 'EL-3342', sold: 80, revenue: 28000, trend: '+6%' },
  { rank: 5, name: 'Men\'s Slim Chinos', sku: 'MW-2210', sold: 74, revenue: 11100, trend: '-3%' },
];

// const radialData = [
//   { name: 'Electronics', value: 82, fill: COLORS.primary },
//   { name: "Men's Wear", value: 65, fill: '#7c3aed' },
//   { name: 'Home Decor', value: 44, fill: COLORS.success },
//   { name: 'Accessories', value: 91, fill: COLORS.warning },
// ];

// ── CUSTOM TOOLTIP ─────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        backgroundColor: COLORS.white,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 10,
        padding: '10px 14px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        fontSize: 12,
      }}
    >
      <p style={{ color: COLORS.textMuted, fontWeight: 600, marginBottom: 6 }}>{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color, fontWeight: 500 }}>
          {p.name}: ₹{(p.value / 1000).toFixed(1)}k
        </p>
      ))}
    </div>
  );
};

const OrderTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        backgroundColor: COLORS.white,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 10,
        padding: '8px 12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        fontSize: 12,
      }}
    >
      <p style={{ color: COLORS.textMuted, marginBottom: 4 }}>{label}</p>
      <p style={{ color: COLORS.primary, fontWeight: 700 }}>{payload[0].value} orders</p>
    </div>
  );
};

// ── KPI CARD ───────────────────────────────────────────────
interface KpiCardProps {
  title: string;
  value: string;
  trend: string;
  trendUp: boolean;
  icon: LucideIcon;
  accent: string;
  accentBg: string;
  sub: string;
}

const KpiCard = ({ title, value, trend, trendUp, icon: Icon, accent, accentBg, sub }: KpiCardProps) => (
  <div
    className="rounded-2xl p-5 transition-all duration-200 hover:shadow-md"
    style={{
      backgroundColor: COLORS.white,
      border: `1px solid ${COLORS.border}`,
    }}
    onMouseEnter={(e) => {
      (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
      (e.currentTarget as HTMLDivElement).style.borderColor = accent;
    }}
    onMouseLeave={(e) => {
      (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
      (e.currentTarget as HTMLDivElement).style.borderColor = COLORS.border;
    }}
  >
    <div className="flex items-center justify-between mb-4">
      <div className="rounded-xl p-2.5" style={{ backgroundColor: accentBg }}>
        <Icon size={20} style={{ color: accent }} />
      </div>
      <div
        className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold"
        style={{
          backgroundColor: trendUp ? '#f0fdf4' : '#fef2f2',
          color: trendUp ? COLORS.success : COLORS.danger,
        }}
      >
        {trend}
        {trendUp ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
      </div>
    </div>
    <h4 className="text-2xl font-bold" style={{ color: COLORS.textPrimary }}>{value}</h4>
    <div className="mt-1 flex items-center gap-1.5">
      <p className="text-sm font-medium" style={{ color: COLORS.textSecondary }}>{title}</p>
      <span className="text-xs" style={{ color: COLORS.textMuted }}>· {sub}</span>
    </div>
  </div>
);

// ── MAIN COMPONENT ─────────────────────────────────────────
export default function AdminDashboard() {
  const [activePie, setActivePie] = useState(0);
  const [chartView, setChartView] = useState<'revenue' | 'orders'>('revenue');

  const totalCategoryValue = categoryData.reduce((s, c) => s + c.value, 0);

  return (
    <div className="space-y-6 pb-10" style={{ color: COLORS.textPrimary }}>

      {/* ── Header ── */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mt-2">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: COLORS.textPrimary }}>Dashboard</h1>
          <p className="text-sm mt-0.5" style={{ color: COLORS.textMuted }}>Welcome back, Admin — here's today's snapshot.</p>
        </div>
        <div className="flex gap-2">
          <button
            className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors"
            style={{
              border: `1.5px solid ${COLORS.border}`,
              backgroundColor: COLORS.white,
              color: COLORS.textSecondary,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = COLORS.primary; e.currentTarget.style.color = COLORS.primary; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.color = COLORS.textSecondary; }}
          >
            <Calendar size={15} /> Dec 30, 2025
          </button>
          <button
            className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white transition-all"
            style={{ backgroundColor: COLORS.primary, boxShadow: `0 4px 12px ${COLORS.primary}40` }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = COLORS.primaryHover; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = COLORS.primary; }}
          >
            <ShoppingCart size={15} /> + New Invoice
          </button>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Total Sales" value="₹1,24,500" trend="+12%" trendUp icon={TrendingUp} accent={COLORS.primary} accentBg={COLORS.primaryLight} sub="vs. yesterday" />
        <KpiCard title="Net Profit" value="₹42,000" trend="+8%" trendUp icon={DollarSign} accent={COLORS.success} accentBg="#f0fdf4" sub="Real-time margin" />
        <KpiCard title="Receivables" value="₹18,300" trend="-2%" trendUp={false} icon={Wallet} accent={COLORS.warning} accentBg="#fffbeb" sub="3 clients due" />
        <KpiCard title="New Orders" value="14" trend="+4" trendUp icon={CheckCircle2} accent="#7c3aed" accentBg="#faf5ff" sub="Pending process" />
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* Revenue + Orders Chart */}
        <div
          className="lg:col-span-2 rounded-2xl p-6"
          style={{ backgroundColor: COLORS.white, border: `1px solid ${COLORS.border}` }}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-semibold" style={{ color: COLORS.textPrimary }}>
                {chartView === 'revenue' ? 'Revenue vs Profit' : 'Daily Order Volume'}
              </h3>
              <p className="text-xs mt-0.5" style={{ color: COLORS.textMuted }}>Last 7 Days Performance</p>
            </div>
            <div className="flex items-center gap-2">
              {(['revenue', 'orders'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setChartView(v)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all"
                  style={{
                    backgroundColor: chartView === v ? COLORS.primary : COLORS.background,
                    color: chartView === v ? COLORS.white : COLORS.textSecondary,
                    border: `1px solid ${chartView === v ? COLORS.primary : COLORS.border}`,
                  }}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              {chartView === 'revenue' ? (
                <AreaChart data={salesData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.15} />
                      <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.success} stopOpacity={0.15} />
                      <stop offset="95%" stopColor={COLORS.success} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={COLORS.borderTrack} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: COLORS.textMuted }} dy={8} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: COLORS.textMuted }} tickFormatter={(v) => `₹${v / 1000}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="sales" name="Sales" stroke={COLORS.primary} strokeWidth={2.5} fillOpacity={1} fill="url(#gSales)" dot={false} activeDot={{ r: 5, fill: COLORS.primary }} />
                  <Area type="monotone" dataKey="profit" name="Profit" stroke={COLORS.success} strokeWidth={2.5} fillOpacity={1} fill="url(#gProfit)" dot={false} activeDot={{ r: 5, fill: COLORS.success }} />
                </AreaChart>
              ) : (
                <BarChart data={weeklyOrders} margin={{ top: 4, right: 4, left: 0, bottom: 0 }} barSize={32}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={COLORS.borderTrack} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: COLORS.textMuted }} dy={8} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: COLORS.textMuted }} />
                  <Tooltip content={<OrderTooltip />} />
                  <Bar dataKey="orders" radius={[6, 6, 0, 0]}>
                    {weeklyOrders.map((_, i) => (
                      <Cell key={i} fill={i === 2 ? COLORS.primary : `${COLORS.primary}55`} />
                    ))}
                  </Bar>
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          {chartView === 'revenue' && (
            <div className="flex items-center gap-5 mt-4 pt-4" style={{ borderTop: `1px solid ${COLORS.borderTrack}` }}>
              {[{ label: 'Sales', color: COLORS.primary }, { label: 'Profit', color: COLORS.success }].map((l) => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: l.color }} />
                  <span className="text-xs" style={{ color: COLORS.textMuted }}>{l.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Alerts Panel */}
        <div
          className="flex flex-col rounded-2xl overflow-hidden"
          style={{ backgroundColor: COLORS.white, border: `1px solid ${COLORS.border}` }}
        >
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: `1px solid ${COLORS.border}`, backgroundColor: '#fff8f8' }}
          >
            <h3 className="flex items-center gap-2 font-bold text-sm" style={{ color: COLORS.danger }}>
              <AlertTriangle size={16} /> Action Required
            </h3>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: COLORS.danger, color: COLORS.white }}
            >
              {alerts.length}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto divide-y">
            {alerts.map((alert, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 px-5 py-4 transition-colors"
                style={{ borderBottom: `1px solid ${COLORS.borderTrack}` }}
                onMouseEnter={(e) => (e.currentTarget as HTMLDivElement).style.backgroundColor = COLORS.rowHover}
                onMouseLeave={(e) => (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent'}
              >
                <div
                  className="mt-1.5 w-2 h-2 rounded-full shrink-0"
                  style={{
                    backgroundColor:
                      alert.type === 'critical' ? COLORS.danger
                      : alert.type === 'warning' ? COLORS.warning
                      : COLORS.info,
                    animation: alert.type === 'critical' ? 'pulse 2s infinite' : 'none',
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold" style={{ color: COLORS.textPrimary }}>{alert.msg}</p>
                  <p className="text-xs mt-0.5 truncate" style={{ color: COLORS.textMuted }}>{alert.sub}</p>
                  <button
                    className="text-xs font-semibold mt-2 transition-colors"
                    style={{ color: COLORS.primary }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.primaryHover)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = COLORS.primary)}
                  >
                    Resolve →
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div
            className="px-5 py-3 text-center"
            style={{ borderTop: `1px solid ${COLORS.border}`, backgroundColor: COLORS.background }}
          >
            <button className="text-xs font-medium transition-colors" style={{ color: COLORS.textMuted }}
              onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.primary)}
              onMouseLeave={(e) => (e.currentTarget.style.color = COLORS.textMuted)}
            >
              View All Notifications
            </button>
          </div>
        </div>
      </div>

      {/* ── Bottom Row ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* Top Products Table */}
        <div
          className="lg:col-span-2 rounded-2xl overflow-hidden"
          style={{ backgroundColor: COLORS.white, border: `1px solid ${COLORS.border}` }}
        >
          <div
            className="flex items-center justify-between px-6 py-4"
            style={{ borderBottom: `1px solid ${COLORS.border}` }}
          >
            <div>
              <h3 className="font-semibold text-sm" style={{ color: COLORS.textPrimary }}>Top Selling Products</h3>
              <p className="text-xs mt-0.5" style={{ color: COLORS.textMuted }}>By revenue this week</p>
            </div>
            <button
              className="p-2 rounded-lg transition-colors"
              style={{ backgroundColor: COLORS.background }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = COLORS.primaryLight; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = COLORS.background; }}
            >
              <RefreshCw size={14} style={{ color: COLORS.textMuted }} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: COLORS.background }}>
                  {['#', 'Product', 'SKU', 'Sold', 'Revenue', 'Trend'].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider"
                      style={{ color: COLORS.textMuted, borderBottom: `1px solid ${COLORS.border}` }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {topProducts.map((p, i) => {
                  const isPos = p.trend.startsWith('+');
                  return (
                    <tr
                      key={i}
                      className="transition-colors"
                      style={{ borderBottom: `1px solid ${COLORS.borderTrack}` }}
                      onMouseEnter={(e) => (e.currentTarget as HTMLTableRowElement).style.backgroundColor = COLORS.rowHover}
                      onMouseLeave={(e) => (e.currentTarget as HTMLTableRowElement).style.backgroundColor = 'transparent'}
                    >
                      <td className="px-5 py-3.5">
                        <span
                          className="w-6 h-6 rounded-full inline-flex items-center justify-center text-[11px] font-bold"
                          style={{
                            backgroundColor: p.rank === 1 ? '#fef9c3' : p.rank === 2 ? '#f3f4f6' : '#fef2f2',
                            color: p.rank === 1 ? '#b45309' : p.rank === 2 ? COLORS.textSecondary : COLORS.textMuted,
                          }}
                        >
                          {p.rank}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-semibold" style={{ color: COLORS.textPrimary }}>{p.name}</td>
                      <td className="px-5 py-3.5">
                        <span
                          className="font-mono text-[11px] px-2 py-0.5 rounded-md"
                          style={{ backgroundColor: COLORS.primaryLight, color: COLORS.primary }}
                        >
                          {p.sku}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-medium" style={{ color: COLORS.textSecondary }}>{p.sold}</td>
                      <td className="px-5 py-3.5 font-bold" style={{ color: COLORS.textPrimary }}>₹{p.revenue.toLocaleString()}</td>
                      <td className="px-5 py-3.5">
                        <span
                          className="flex items-center gap-1 text-xs font-semibold w-fit px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: isPos ? '#f0fdf4' : '#fef2f2',
                            color: isPos ? COLORS.success : COLORS.danger,
                          }}
                        >
                          {isPos ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                          {p.trend}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column: Dead Stock + Category Donut */}
        <div className="flex flex-col gap-6">

          {/* Dead Stock */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{ backgroundColor: COLORS.white, border: `1px solid ${COLORS.border}` }}
          >
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: `1px solid ${COLORS.border}` }}
            >
              <h3 className="flex items-center gap-2 text-sm font-semibold" style={{ color: COLORS.textPrimary }}>
                <PackageX size={15} style={{ color: COLORS.textMuted }} /> Dead Stock
              </h3>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: '#fffbeb', color: COLORS.warning, border: `1px solid ${COLORS.warning}30` }}
              >
                Blocked Capital
              </span>
            </div>
            <div className="divide-y">
              {deadStockData.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-5 py-3 transition-colors"
                  style={{ borderBottom: i < deadStockData.length - 1 ? `1px solid ${COLORS.borderTrack}` : 'none' }}
                  onMouseEnter={(e) => (e.currentTarget as HTMLDivElement).style.backgroundColor = COLORS.rowHover}
                  onMouseLeave={(e) => (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent'}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{
                        backgroundColor:
                          item.risk === 'critical' ? COLORS.danger
                          : item.risk === 'high' ? COLORS.warning
                          : COLORS.info,
                      }}
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold truncate" style={{ color: COLORS.textPrimary }}>{item.name}</p>
                      <p className="flex items-center gap-1 text-[11px] mt-0.5" style={{ color: COLORS.dangerLight }}>
                        <Clock size={10} /> {item.lastSold}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs font-bold ml-3 shrink-0" style={{ color: COLORS.textPrimary }}>
                    ₹{item.value.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Category breakdown donut */}
          <div
            className="rounded-2xl p-5"
            style={{ backgroundColor: COLORS.white, border: `1px solid ${COLORS.border}` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold" style={{ color: COLORS.textPrimary }}>Category Split</h3>
                <p className="text-xs" style={{ color: COLORS.textMuted }}>By revenue share</p>
              </div>
              <Boxes size={15} style={{ color: COLORS.textMuted }} />
            </div>

            <div className="relative flex justify-center mb-4">
              <ResponsiveContainer width={140} height={140}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={42}
                    outerRadius={64}
                    paddingAngle={3}
                    dataKey="value"
                    onMouseEnter={(_, index) => setActivePie(index)}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        strokeWidth={0}
                        opacity={activePie === index ? 1 : 0.65}
                        className="cursor-pointer transition-all"
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[11px]" style={{ color: COLORS.textMuted }}>Total</span>
                <span className="text-lg font-bold" style={{ color: COLORS.textPrimary }}>₹97k</span>
              </div>
            </div>

            <div className="space-y-2.5">
              {categoryData.map((cat, i) => {
                const Icon = cat.icon;
                const pct = Math.round((cat.value / totalCategoryValue) * 100);
                const isPos = cat.growth.startsWith('+');
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 cursor-pointer"
                    onMouseEnter={() => setActivePie(i)}
                  >
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${cat.color}18` }}>
                      <Icon size={13} style={{ color: cat.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium truncate" style={{ color: COLORS.textPrimary }}>{cat.name}</span>
                        <span className="text-[11px] font-semibold ml-2 shrink-0" style={{ color: isPos ? COLORS.success : COLORS.danger }}>
                          {cat.growth}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: COLORS.neutralHover }}>
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%`, backgroundColor: cat.color }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}