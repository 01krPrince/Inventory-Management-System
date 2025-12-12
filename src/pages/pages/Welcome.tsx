import PageMeta from "../../components/common/PageMeta";
import PieGraph from "../Charts/PieGraph";
import BarChart from "../Charts/BarChart";
import Badge from "../../components/ui/badge/Badge";
import {
  Package,
  AlertTriangle,
  DollarSign,
  ShoppingCart,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
} from "lucide-react";

export default function InventoryDashboard() {
  // --- 1. KPI Metrics Data (Inventory Focused) ---
  const metrics = [
    {
      name: "Total Inventory Value",
      value: "$142,845",
      change: "12.5%",
      trend: "up",
      icon: DollarSign,
      color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    },
    {
      name: "Total Products (SKUs)",
      value: "3,782",
      change: "4.2%",
      trend: "up",
      icon: Package,
      color:
        "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400",
    },
    {
      name: "Low Stock Items",
      value: "24",
      change: "5 New",
      trend: "down", // "down" here means bad news usually, or increased count
      icon: AlertTriangle,
      color:
        "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
      alert: true,
    },
    {
      name: "Pending Orders",
      value: "148",
      change: "High",
      trend: "up",
      icon: ShoppingCart,
      color:
        "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
    },
  ];

  // --- 2. Chart Data ---

  // Re-purposing Pie Charts for Inventory Context
  const stockStatusData = [
    { name: "In Stock", value: 3200 },
    { name: "Low Stock", value: 450 },
    { name: "Out of Stock", value: 132 },
  ];
  const stockColors = ["#10B981", "#F59E0B", "#EF4444"]; // Green, Orange, Red

  const categoryValueData = [
    { name: "Electronics", value: 45000 },
    { name: "Apparel", value: 25000 },
    { name: "Home & Garden", value: 15000 },
    { name: "Accessories", value: 10000 },
  ];
  const categoryColors = ["#3B82F6", "#8B5CF6", "#10B981", "#F43F5E"];

  // Mock data for the "Low Stock Alerts" table
  const lowStockItems = [
    {
      id: "SKU-901",
      name: "Wireless Earbuds",
      stock: 2,
      threshold: 10,
      category: "Electronics",
    },
    {
      id: "SKU-202",
      name: "Leather Wallet",
      stock: 5,
      threshold: 15,
      category: "Accessories",
    },
    {
      id: "SKU-104",
      name: "Smart Watch Gen 4",
      stock: 0,
      threshold: 5,
      category: "Electronics",
    },
    {
      id: "SKU-305",
      name: "Cotton T-Shirt (L)",
      stock: 8,
      threshold: 20,
      category: "Apparel",
    },
  ];

  return (
    <>
      <PageMeta
        title="Inventory Dashboard | Admin Panel"
        description="Professional Inventory Management Overview"
      />

      <div className="space-y-6 mt-3">
        {/* HEADER SECTION */}
        {/* <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Inventory Overview
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Real-time snapshot of your stock, value, and fulfillment status.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300">
              Export Report
            </button>
            <button className="px-4 py-2 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700 shadow-sm">
              + Add Product
            </button>
          </div>
        </div> */}

        {/* 1. METRICS GRID */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            const isAlert = metric.alert;

            return (
              <div
                key={index}
                className={`relative overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-800 ${
                  isAlert ? "border-l-4 border-l-orange-500" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className={`rounded-lg p-3 ${metric.color}`}>
                    <Icon size={22} />
                  </div>
                  {metric.trend && (
                    <Badge
                      color={
                        metric.trend === "up" && !isAlert ? "success" : "error"
                      }
                    >
                      <span className="flex items-center gap-1">
                        {metric.change}
                        {metric.trend === "up" ? (
                          <ArrowUpRight size={12} />
                        ) : (
                          <ArrowDownRight size={12} />
                        )}
                      </span>
                    </Badge>
                  )}
                </div>

                <div className="mt-4">
                  <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {metric.value}
                  </h4>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {metric.name}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 2. MAIN ANALYTICS ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart: Sales/Movement */}
          <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800">
            <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4 dark:border-gray-700">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Inventory Movement & Sales
                </h3>
                <p className="text-xs text-gray-500">
                  Sales vs Purchase trends over time
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-blue-500"></span>
                  <span className="text-xs text-gray-500">Sales</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-green-500"></span>
                  <span className="text-xs text-gray-500">Stock In</span>
                </div>
              </div>
            </div>
            {/* Using the generic BarChart component here - assume it handles resizing */}
            <div className="h-[300px] w-full">
              <BarChart />
            </div>
          </div>

          {/* Secondary: Stock Status */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800">
            <h3 className="mb-1 text-lg font-semibold text-gray-800 dark:text-white">
              Stock Status
            </h3>
            <p className="mb-6 text-xs text-gray-500">
              Distribution by availability
            </p>

            <div className="relative">
              <PieGraph
                data={stockStatusData}
                dataKey="value"
                nameKey="name"
                colors={stockColors}
                innerRadius={60}
                outerRadius={90}
                height={220}
                showLegend={false}
              />
              {/* Centered Text Overlay for Donut Chart */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-gray-800 dark:text-white">
                  96%
                </span>
                <span className="text-xs text-gray-500">Fulfilled</span>
              </div>
            </div>

            {/* Custom Legend */}
            <div className="mt-4 space-y-3">
              {stockStatusData.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="size-3 rounded-full"
                      style={{ backgroundColor: stockColors[idx] }}
                    ></span>
                    <span className="text-gray-600 dark:text-gray-300">
                      {item.name}
                    </span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. DETAILED METRICS & TABLES ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Low Stock Alerts Table */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                <AlertTriangle size={18} className="text-orange-500" />
                Low Stock Alerts
              </h3>
              <button className="text-sm text-blue-600 hover:underline">
                View All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-700 text-gray-500">
                    <th className="pb-3 font-medium">Product</th>
                    <th className="pb-3 font-medium">Category</th>
                    <th className="pb-3 font-medium text-right">Stock</th>
                    <th className="pb-3 font-medium text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {lowStockItems.map((item) => (
                    <tr
                      key={item.id}
                      className="group hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <td className="py-3">
                        <div className="font-medium text-gray-800 dark:text-white">
                          {item.name}
                        </div>
                        <div className="text-xs text-gray-400">{item.id}</div>
                      </td>
                      <td className="py-3 text-gray-600 dark:text-gray-300">
                        {item.category}
                      </td>
                      <td className="py-3 text-right font-medium text-gray-800 dark:text-white">
                        {item.stock} /{" "}
                        <span className="text-gray-400 text-xs">
                          {item.threshold}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        {item.stock === 0 ? (
                          <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                            Out of Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-orange-50 px-2 py-1 text-xs font-medium text-orange-700 ring-1 ring-inset ring-orange-600/10">
                            Low Stock
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Value by Category Chart */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800 flex flex-col">
            <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
              <Activity size={18} className="text-blue-500" />
              Value by Category
            </h3>
            <div className="flex-1 flex items-center justify-center">
              <PieGraph
                data={categoryValueData}
                dataKey="value"
                nameKey="name"
                colors={categoryColors}
                innerRadius={0}
                outerRadius={110}
                height={300}
                showLegend={true}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
