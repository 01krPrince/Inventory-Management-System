import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Package,
  Warehouse,
  AlertTriangle,
  Truck,
  Percent,
  DollarSign,
  Clock,
  RefreshCw,
  MoreVertical,
  ArrowUpRight,
  Edit,
} from "lucide-react";

const mockMonthlyMovement = [
  { month: "Jan", inbound: 12400, outbound: 9800, net: 2600 },
  { month: "Feb", inbound: 15200, outbound: 11800, net: 3400 },
  { month: "Mar", inbound: 13800, outbound: 14200, net: -400 },
  { month: "Apr", inbound: 16800, outbound: 13200, net: 3600 },
  { month: "May", inbound: 18200, outbound: 15800, net: 2400 },
  { month: "Jun", inbound: 19500, outbound: 17200, net: 2300 },
  { month: "Jul", inbound: 17800, outbound: 16500, net: 1300 },
  { month: "Aug", inbound: 21200, outbound: 18800, net: 2400 },
  { month: "Sep", inbound: 22800, outbound: 20200, net: 2600 },
  { month: "Oct", inbound: 24500, outbound: 21800, net: 2700 },
  { month: "Nov", inbound: 26200, outbound: 23500, net: 2700 },
  { month: "Dec", inbound: 28000, outbound: 24800, net: 3200 },
];

const mockInboundOutbound = [
  { month: "Jan", inbound: 12400, outbound: 9800 },
  { month: "Feb", inbound: 15200, outbound: 11800 },
  { month: "Mar", inbound: 13800, outbound: 14200 },
  { month: "Apr", inbound: 16800, outbound: 13200 },
  { month: "May", inbound: 18200, outbound: 15800 },
  { month: "Jun", inbound: 19500, outbound: 17200 },
];

const mockValuationTrend = [
  { month: "Jan", value: 2850000 },
  { month: "Feb", value: 2980000 },
  { month: "Mar", value: 2950000 },
  { month: "Apr", value: 3120000 },
  { month: "May", value: 3280000 },
  { month: "Jun", value: 3420000 },
  { month: "Jul", value: 3550000 },
  { month: "Aug", value: 3720000 },
  { month: "Sep", value: 3920000 },
  { month: "Oct", value: 4150000 },
  { month: "Nov", value: 4380000 },
  { month: "Dec", value: 4650000 },
];

const warehouseValueData = [
  { name: "WH-01 (North)", value: 1850000, fill: "#3b82f6" },
  { name: "WH-02 (South)", value: 1280000, fill: "#10b981" },
  { name: "WH-03 (East)", value: 920000, fill: "#f59e0b" },
  { name: "WH-04 (West)", value: 600000, fill: "#ef4444" },
];

const categoryData = [
  { name: "Electronics", value: 1580000, fill: "#8b5cf6" },
  { name: "Apparel", value: 980000, fill: "#ec4899" },
  { name: "Home & Kitchen", value: 820000, fill: "#14b8a6" },
  { name: "Sports", value: 540000, fill: "#f97316" },
  { name: "Books & Media", value: 310000, fill: "#6366f1" },
];

const stockMasterData = [
  {
    sku: "ELE-1001",
    name: "Wireless Headphones Pro",
    category: "Electronics",
    warehouse: "WH-01",
    stock: 342,
    reorder: 100,
    status: "healthy",
  },
  {
    sku: "APP-2056",
    name: "Premium Cotton T-Shirt",
    category: "Apparel",
    warehouse: "WH-02",
    stock: 89,
    reorder: 150,
    status: "low",
  },
  {
    sku: "KIT-3342",
    name: "Non-Stick Cookware Set",
    category: "Home & Kitchen",
    warehouse: "WH-03",
    stock: 12,
    reorder: 50,
    status: "critical",
  },
  {
    sku: "SPO-7890",
    name: "Yoga Mat Premium",
    category: "Sports",
    warehouse: "WH-01",
    stock: 567,
    reorder: 200,
    status: "healthy",
  },
  {
    sku: "ELE-2234",
    name: "Smart Watch Series X",
    category: "Electronics",
    warehouse: "WH-04",
    stock: 45,
    reorder: 80,
    status: "low",
  },
  {
    sku: "APP-1123",
    name: "Winter Jacket XL",
    category: "Apparel",
    warehouse: "WH-02",
    stock: 8,
    reorder: 100,
    status: "critical",
  },
  {
    sku: "KIT-5567",
    name: "Blender Pro 2000W",
    category: "Home & Kitchen",
    warehouse: "WH-01",
    stock: 234,
    reorder: 80,
    status: "healthy",
  },
  {
    sku: "BOK-9901",
    name: "Bestseller Novel Collection",
    category: "Books & Media",
    warehouse: "WH-03",
    stock: 1200,
    reorder: 300,
    status: "healthy",
  },
  {
    sku: "ELE-6678",
    name: "4K Webcam Ultra",
    category: "Electronics",
    warehouse: "WH-02",
    stock: 28,
    reorder: 60,
    status: "critical",
  },
  {
    sku: "SPO-3344",
    name: "Running Shoes Air",
    category: "Sports",
    warehouse: "WH-04",
    stock: 156,
    reorder: 120,
    status: "healthy",
  },
  ...Array.from({ length: 40 }, (_, i) => ({
    sku: `SKU-${1000 + i + 10}`,
    name: `Product Item ${i + 11}`,
    category: [
      "Electronics",
      "Apparel",
      "Home & Kitchen",
      "Sports",
      "Books & Media",
    ][Math.floor(Math.random() * 5)],
    warehouse: `WH-0${Math.floor(Math.random() * 4) + 1}`,
    stock: Math.floor(Math.random() * 800),
    reorder: Math.floor(Math.random() * 200) + 50,
    status: ["healthy", "low", "critical"][Math.floor(Math.random() * 3)],
  })),
];

const pendingTransfers = [
  {
    id: "TR-2025-001",
    from: "WH-01",
    to: "WH-03",
    sku: "ELE-1001",
    qty: 150,
    status: "in-transit",
    eta: "2025-12-20",
  },
  {
    id: "TR-2025-002",
    from: "WH-02",
    to: "WH-04",
    sku: "APP-2056",
    qty: 200,
    status: "scheduled",
    eta: "2025-12-22",
  },
  {
    id: "TR-2025-003",
    from: "WH-03",
    to: "WH-01",
    sku: "KIT-3342",
    qty: 80,
    status: "delayed",
    eta: "2025-12-19",
  },
  {
    id: "TR-2025-004",
    from: "WH-04",
    to: "WH-02",
    sku: "SPO-7890",
    qty: 300,
    status: "in-transit",
    eta: "2025-12-21",
  },
  {
    id: "TR-2025-005",
    from: "WH-01",
    to: "WH-02",
    sku: "ELE-2234",
    qty: 100,
    status: "scheduled",
    eta: "2025-12-23",
  },
];

const purchaseOrders = [
  {
    po: "PO-2025-1101",
    vendor: "TechSupply Inc",
    items: 12,
    totalValue: 125000,
    status: "received",
    receivedDate: "2025-12-15",
  },
  {
    po: "PO-2025-1102",
    vendor: "ApparelWorld",
    items: 45,
    totalValue: 89000,
    status: "partial",
    receivedDate: "2025-12-17",
  },
  {
    po: "PO-2025-1103",
    vendor: "KitchenPro Ltd",
    items: 28,
    totalValue: 156000,
    status: "pending",
    receivedDate: "-",
  },
  {
    po: "PO-2025-1104",
    vendor: "SportsGear Co",
    items: 60,
    totalValue: 210000,
    status: "in-transit",
    receivedDate: "2025-12-20",
  },
  {
    po: "PO-2025-1105",
    vendor: "MediaHouse",
    items: 150,
    totalValue: 45000,
    status: "received",
    receivedDate: "2025-12-10",
  },
];

const lowStockAlerts = [
  {
    sku: "KIT-3342",
    name: "Non-Stick Cookware Set",
    current: 12,
    reorder: 50,
    warehouse: "WH-03",
    urgency: "critical",
  },
  {
    sku: "APP-1123",
    name: "Winter Jacket XL",
    current: 8,
    reorder: 100,
    warehouse: "WH-02",
    urgency: "critical",
  },
  {
    sku: "ELE-6678",
    name: "4K Webcam Ultra",
    current: 28,
    reorder: 60,
    warehouse: "WH-02",
    urgency: "critical",
  },
  {
    sku: "APP-2056",
    name: "Premium Cotton T-Shirt",
    current: 89,
    reorder: 150,
    warehouse: "WH-02",
    urgency: "low",
  },
  {
    sku: "ELE-2234",
    name: "Smart Watch Series X",
    current: 45,
    reorder: 80,
    warehouse: "WH-04",
    urgency: "low",
  },
];

const warehousePerformance = [
  {
    id: "WH-01",
    name: "North Regional Warehouse",
    capacity: 85,
    utilization: 88,
    inbound: 12450,
    outbound: 9850,
  },
  {
    id: "WH-02",
    name: "South Distribution Center",
    capacity: 92,
    utilization: 76,
    inbound: 9850,
    outbound: 11200,
  },
  {
    id: "WH-03",
    name: "East Logistics Hub",
    capacity: 78,
    utilization: 94,
    inbound: 8760,
    outbound: 8200,
  },
  {
    id: "WH-04",
    name: "West Fulfillment Center",
    capacity: 65,
    utilization: 82,
    inbound: 6540,
    outbound: 7200,
  },
];

const activityLog = [
  {
    time: "2025-12-18 14:32",
    user: "j.doe",
    action: "Stock Adjustment",
    details: "Adjusted +50 units for SKU ELE-1001",
    type: "adjustment",
  },
  {
    time: "2025-12-18 13:15",
    user: "a.smith",
    action: "Transfer Initiated",
    details: "TR-2025-005: WH-01 → WH-02",
    type: "transfer",
  },
  {
    time: "2025-12-18 11:48",
    user: "system",
    action: "PO Received",
    details: "PO-2025-1101 fully received",
    type: "receive",
  },
  {
    time: "2025-12-18 10:22",
    user: "m.lee",
    action: "Stock Update",
    details: "Outbound -120 units SKU APP-2056",
    type: "outbound",
  },
  {
    time: "2025-12-18 09:05",
    user: "system",
    action: "Low Stock Alert",
    details: "SKU KIT-3342 below reorder level",
    type: "alert",
  },
];

export const Welcome: React.FC = () => {
  // const [dateRange, setDateRange] = useState("Last 30 Days");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Header */}
      {/* <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Inventory Management Overview
            </h1>
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-gray-500" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm font-medium text-gray-900 dark:text-white"
              >
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Last Quarter</option>
                <option>Last Year</option>
                <option>Custom Range</option>
              </select>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <Bell className="w-6 h-6" />
              <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                8
              </span>
            </button>
            <div className="flex items-center space-x-3 pl-4 border-l border-gray-300 dark:border-gray-600">
              <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                JD
              </div>
              <div className="text-sm">
                <p className="font-medium text-gray-900 dark:text-white">
                  John Doe
                </p>
                <p className="text-gray-500 dark:text-gray-400">Admin</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>
          </div>
        </div>
      </header> */}

      {/* KPI Cards */}
      <div className="px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Inventory Value
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  $4,650,000
                </p>
                <div className="flex items-center mt-3">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    +12.5%
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                    vs last month
                  </span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <DollarSign className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total SKUs
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  8,429
                </p>
                <div className="flex items-center mt-3">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    +3.2%
                  </span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Package className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Active Warehouses
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  4
                </p>
                <div className="flex items-center mt-3">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    All operational
                  </span>
                </div>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <Warehouse className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Low Stock Alerts
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  23
                </p>
                <div className="flex items-center mt-3">
                  <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  <span className="text-sm font-medium text-red-600 dark:text-red-400">
                    -8
                  </span>
                </div>
              </div>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <AlertTriangle className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Pending Transfers
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  5
                </p>
                <div className="flex items-center mt-3">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    In progress
                  </span>
                </div>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <Truck className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Order Fulfillment %
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  98.4%
                </p>
                <div className="flex items-center mt-3">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    +1.2%
                  </span>
                </div>
              </div>
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                <Percent className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Analytics */}
      <div className="px-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Advanced Analytics
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Inventory Movement (Last 12 Months)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockMonthlyMovement}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="inbound"
                  stroke="#10b981"
                  strokeWidth={3}
                  name="Inbound"
                />
                <Line
                  type="monotone"
                  dataKey="outbound"
                  stroke="#ef4444"
                  strokeWidth={3}
                  name="Outbound"
                />
                <Line
                  type="monotone"
                  dataKey="net"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Net Change"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Inbound vs Outbound
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockInboundOutbound}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="inbound" fill="#10b981" />
                <Bar dataKey="outbound" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Stock Valuation Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={mockValuationTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value) => `$${Number(value).toLocaleString()}`}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#6366f1"
                  fill="#a78bfa"
                  fillOpacity={0.4}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Distribution & Breakdown */}
      <div className="px-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Distribution & Breakdown
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Inventory Value by Warehouse
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={warehouseValueData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {warehouseValueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `$${Number(value).toLocaleString()}`}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Category-wise Stock Value
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  dataKey="value"
                  label
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `$${Number(value).toLocaleString()}`}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Data Tables */}
      <div className="px-6 mb-8 space-y-8">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Stock Master
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      SKU
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Product Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Warehouse
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Stock Level
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Reorder Level
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {stockMasterData.map((item) => (
                    <tr
                      key={item.sku}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                        {item.sku}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {item.category}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {item.warehouse}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                        {item.stock}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {item.reorder}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                            item.status === "healthy"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : item.status === "low"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          }`}
                        >
                          {item.status === "critical"
                            ? "Critical"
                            : item.status === "low"
                            ? "Low Stock"
                            : "Healthy"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Pending Transfers
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                        Transfer ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                        From → To
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                        SKU
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                        Qty
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                        ETA
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {pendingTransfers.map((t) => (
                      <tr
                        key={t.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="px-6 py-4 text-sm font-medium">
                          {t.id}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {t.from} → {t.to}
                        </td>
                        <td className="px-6 py-4 text-sm">{t.sku}</td>
                        <td className="px-6 py-4 text-sm font-semibold">
                          {t.qty}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                              t.status === "in-transit"
                                ? "bg-blue-100 text-blue-800"
                                : t.status === "scheduled"
                                ? "bg-gray-100 text-gray-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {t.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">{t.eta}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Recent Purchase Orders
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                        PO #
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                        Vendor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                        Items
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                        Value
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                        Received
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {purchaseOrders.map((po) => (
                      <tr
                        key={po.po}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="px-6 py-4 text-sm font-medium">
                          {po.po}
                        </td>
                        <td className="px-6 py-4 text-sm">{po.vendor}</td>
                        <td className="px-6 py-4 text-sm">{po.items}</td>
                        <td className="px-6 py-4 text-sm font-semibold">
                          ${po.totalValue.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                              po.status === "received"
                                ? "bg-green-100 text-green-800"
                                : po.status === "partial"
                                ? "bg-yellow-100 text-yellow-800"
                                : po.status === "in-transit"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {po.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">{po.receivedDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts & Exceptions */}
      <div className="px-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Low Stock Alerts & Exceptions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lowStockAlerts.map((alert) => {
            const percentage = (alert.current / alert.reorder) * 100;
            return (
              <div
                key={alert.sku}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {alert.sku}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {alert.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Warehouse: {alert.warehouse}
                    </p>
                  </div>
                  <AlertTriangle
                    className={`w-6 h-6 ${
                      alert.urgency === "critical"
                        ? "text-red-500"
                        : "text-yellow-500"
                    }`}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Current Stock
                    </span>
                    <span className="font-semibold">
                      {alert.current} / {alert.reorder}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${
                        alert.urgency === "critical"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Warehouse Performance */}
      <div className="px-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Warehouse Performance
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {warehousePerformance.map((wh) => (
            <div
              key={wh.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {wh.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {wh.id}
                  </p>
                </div>
                <Warehouse className="w-8 h-8 text-gray-400" />
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">
                      Utilization
                    </span>
                    <span className="font-semibold">{wh.utilization}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-green-500 to-blue-500"
                      style={{ width: `${wh.utilization}%` }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Inbound
                    </p>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                      {wh.inbound.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Outbound
                    </p>
                    <p className="text-lg font-bold text-red-600 dark:text-red-400">
                      {wh.outbound.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Log */}
      <div className="px-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Recent Activity & Audit Log
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {activityLog.map((log, i) => (
              <div
                key={i}
                className="px-6 py-5 flex items-start space-x-4 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <div className="flex-shrink-0">
                  {log.type === "adjustment" && (
                    <Edit className="w-5 h-5 text-blue-500" />
                  )}
                  {log.type === "transfer" && (
                    <Truck className="w-5 h-5 text-purple-500" />
                  )}
                  {log.type === "receive" && (
                    <Package className="w-5 h-5 text-green-500" />
                  )}
                  {log.type === "outbound" && (
                    <ArrowUpRight className="w-5 h-5 text-red-500" />
                  )}
                  {log.type === "alert" && (
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {log.action}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {log.time}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {log.details}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    by {log.user}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>Last updated: December 18, 2025 15:42:18</span>
          </div>
          <div className="flex items-center space-x-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Auto-refresh in 42s</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;

// import PageMeta from "../../components/common/PageMeta";
// import PieGraph from "../Charts/PieGraph";
// import BarChart from "../Charts/BarChart";
// import Badge from "../../components/ui/badge/Badge";
// import {
//   Package,
//   AlertTriangle,
//   DollarSign,
//   ShoppingCart,
//   ArrowUpRight,
//   ArrowDownRight,
//   Activity,
// } from "lucide-react";

// export default function InventoryDashboard() {
//   // --- 1. KPI Metrics Data (Inventory Focused) ---
//   const metrics = [
//     {
//       name: "Total Inventory Value",
//       value: "$142,845",
//       change: "12.5%",
//       trend: "up",
//       icon: DollarSign,
//       color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
//     },
//     {
//       name: "Total Products (SKUs)",
//       value: "3,782",
//       change: "4.2%",
//       trend: "up",
//       icon: Package,
//       color:
//         "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400",
//     },
//     {
//       name: "Low Stock Items",
//       value: "24",
//       change: "5 New",
//       trend: "down", // "down" here means bad news usually, or increased count
//       icon: AlertTriangle,
//       color:
//         "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
//       alert: true,
//     },
//     {
//       name: "Pending Orders",
//       value: "148",
//       change: "High",
//       trend: "up",
//       icon: ShoppingCart,
//       color:
//         "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
//     },
//   ];

//   // --- 2. Chart Data ---

//   // Re-purposing Pie Charts for Inventory Context
//   const stockStatusData = [
//     { name: "In Stock", value: 3200 },
//     { name: "Low Stock", value: 450 },
//     { name: "Out of Stock", value: 132 },
//   ];
//   const stockColors = ["#10B981", "#F59E0B", "#EF4444"]; // Green, Orange, Red

//   const categoryValueData = [
//     { name: "Electronics", value: 45000 },
//     { name: "Apparel", value: 25000 },
//     { name: "Home & Garden", value: 15000 },
//     { name: "Accessories", value: 10000 },
//   ];
//   const categoryColors = ["#3B82F6", "#8B5CF6", "#10B981", "#F43F5E"];

//   // Mock data for the "Low Stock Alerts" table
//   const lowStockItems = [
//     {
//       id: "SKU-901",
//       name: "Wireless Earbuds",
//       stock: 2,
//       threshold: 10,
//       category: "Electronics",
//     },
//     {
//       id: "SKU-202",
//       name: "Leather Wallet",
//       stock: 5,
//       threshold: 15,
//       category: "Accessories",
//     },
//     {
//       id: "SKU-104",
//       name: "Smart Watch Gen 4",
//       stock: 0,
//       threshold: 5,
//       category: "Electronics",
//     },
//     {
//       id: "SKU-305",
//       name: "Cotton T-Shirt (L)",
//       stock: 8,
//       threshold: 20,
//       category: "Apparel",
//     },
//   ];

//   return (
//     <>
//       <PageMeta
//         title="Inventory Dashboard | Admin Panel"
//         description="Professional Inventory Management Overview"
//       />

//       <div className="space-y-6 mt-3">
//         {/* HEADER SECTION */}
//         {/* <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
//               Inventory Overview
//             </h1>
//             <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
//               Real-time snapshot of your stock, value, and fulfillment status.
//             </p>
//           </div>
//           <div className="flex gap-3">
//             <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300">
//               Export Report
//             </button>
//             <button className="px-4 py-2 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700 shadow-sm">
//               + Add Product
//             </button>
//           </div>
//         </div> */}

//         {/* 1. METRICS GRID */}
//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
//           {metrics.map((metric, index) => {
//             const Icon = metric.icon;
//             const isAlert = metric.alert;

//             return (
//               <div
//                 key={index}
//                 className={`relative overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-800 ${
//                   isAlert ? "border-l-4 border-l-orange-500" : ""
//                 }`}
//               >
//                 <div className="flex items-start justify-between">
//                   <div className={`rounded-lg p-3 ${metric.color}`}>
//                     <Icon size={22} />
//                   </div>
//                   {metric.trend && (
//                     <Badge
//                       color={
//                         metric.trend === "up" && !isAlert ? "success" : "error"
//                       }
//                     >
//                       <span className="flex items-center gap-1">
//                         {metric.change}
//                         {metric.trend === "up" ? (
//                           <ArrowUpRight size={12} />
//                         ) : (
//                           <ArrowDownRight size={12} />
//                         )}
//                       </span>
//                     </Badge>
//                   )}
//                 </div>

//                 <div className="mt-4">
//                   <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
//                     {metric.value}
//                   </h4>
//                   <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
//                     {metric.name}
//                   </span>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/* 2. MAIN ANALYTICS ROW */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Main Chart: Sales/Movement */}
//           <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800">
//             <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4 dark:border-gray-700">
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
//                   Inventory Movement & Sales
//                 </h3>
//                 <p className="text-xs text-gray-500">
//                   Sales vs Purchase trends over time
//                 </p>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="flex items-center gap-2">
//                   <span className="size-2 rounded-full bg-blue-500"></span>
//                   <span className="text-xs text-gray-500">Sales</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span className="size-2 rounded-full bg-green-500"></span>
//                   <span className="text-xs text-gray-500">Stock In</span>
//                 </div>
//               </div>
//             </div>
//             {/* Using the generic BarChart component here - assume it handles resizing */}
//             <div className="h-[300px] w-full">
//               <BarChart />
//             </div>
//           </div>

//           {/* Secondary: Stock Status */}
//           <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800">
//             <h3 className="mb-1 text-lg font-semibold text-gray-800 dark:text-white">
//               Stock Status
//             </h3>
//             <p className="mb-6 text-xs text-gray-500">
//               Distribution by availability
//             </p>

//             <div className="relative">
//               <PieGraph
//                 data={stockStatusData}
//                 dataKey="value"
//                 nameKey="name"
//                 colors={stockColors}
//                 innerRadius={60}
//                 outerRadius={90}
//                 height={220}
//                 showLegend={false}
//               />
//               {/* Centered Text Overlay for Donut Chart */}
//               <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
//                 <span className="text-2xl font-bold text-gray-800 dark:text-white">
//                   96%
//                 </span>
//                 <span className="text-xs text-gray-500">Fulfilled</span>
//               </div>
//             </div>

//             {/* Custom Legend */}
//             <div className="mt-4 space-y-3">
//               {stockStatusData.map((item, idx) => (
//                 <div
//                   key={idx}
//                   className="flex items-center justify-between text-sm"
//                 >
//                   <div className="flex items-center gap-2">
//                     <span
//                       className="size-3 rounded-full"
//                       style={{ backgroundColor: stockColors[idx] }}
//                     ></span>
//                     <span className="text-gray-600 dark:text-gray-300">
//                       {item.name}
//                     </span>
//                   </div>
//                   <span className="font-semibold text-gray-900 dark:text-white">
//                     {item.value}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* 3. DETAILED METRICS & TABLES ROW */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Low Stock Alerts Table */}
//           <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
//                 <AlertTriangle size={18} className="text-orange-500" />
//                 Low Stock Alerts
//               </h3>
//               <button className="text-sm text-blue-600 hover:underline">
//                 View All
//               </button>
//             </div>

//             <div className="overflow-x-auto">
//               <table className="w-full text-left text-sm">
//                 <thead>
//                   <tr className="border-b border-gray-100 dark:border-gray-700 text-gray-500">
//                     <th className="pb-3 font-medium">Product</th>
//                     <th className="pb-3 font-medium">Category</th>
//                     <th className="pb-3 font-medium text-right">Stock</th>
//                     <th className="pb-3 font-medium text-right">Status</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
//                   {lowStockItems.map((item) => (
//                     <tr
//                       key={item.id}
//                       className="group hover:bg-gray-50 dark:hover:bg-gray-700/50"
//                     >
//                       <td className="py-3">
//                         <div className="font-medium text-gray-800 dark:text-white">
//                           {item.name}
//                         </div>
//                         <div className="text-xs text-gray-400">{item.id}</div>
//                       </td>
//                       <td className="py-3 text-gray-600 dark:text-gray-300">
//                         {item.category}
//                       </td>
//                       <td className="py-3 text-right font-medium text-gray-800 dark:text-white">
//                         {item.stock} /{" "}
//                         <span className="text-gray-400 text-xs">
//                           {item.threshold}
//                         </span>
//                       </td>
//                       <td className="py-3 text-right">
//                         {item.stock === 0 ? (
//                           <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
//                             Out of Stock
//                           </span>
//                         ) : (
//                           <span className="inline-flex items-center rounded-full bg-orange-50 px-2 py-1 text-xs font-medium text-orange-700 ring-1 ring-inset ring-orange-600/10">
//                             Low Stock
//                           </span>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Value by Category Chart */}
//           <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800 flex flex-col">
//             <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
//               <Activity size={18} className="text-blue-500" />
//               Value by Category
//             </h3>
//             <div className="flex-1 flex items-center justify-center">
//               <PieGraph
//                 data={categoryValueData}
//                 dataKey="value"
//                 nameKey="name"
//                 colors={categoryColors}
//                 innerRadius={0}
//                 outerRadius={110}
//                 height={300}
//                 showLegend={true}
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
