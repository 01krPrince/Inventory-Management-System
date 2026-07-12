import { useState, useMemo } from "react";
import {
  Heart,
  Search,
  ArrowUpRight,
  Package,
  AlertTriangle,
  Download,
  TrendingUp,
  BarChart3,
} from "lucide-react";

// Mock Data representing items gathered from all user wishlists
const WISHLIST_AGGREGATE_DATA = [
  {
    id: "1",
    name: "Cricket Bat (English Willow)",
    sku: "BAT-EW-01",
    wishlistCount: 145,
    totalRequestedQty: 180,
    currentStock: 12,
    category: "Equipment",
  },
  {
    id: "2",
    name: "Leather Ball (Red)",
    sku: "BALL-RD-55",
    wishlistCount: 89,
    totalRequestedQty: 450,
    currentStock: 502,
    category: "Accessories",
  },
  {
    id: "3",
    name: "Batting Pads (Pro)",
    sku: "PAD-PRO-99",
    wishlistCount: 67,
    totalRequestedQty: 90,
    currentStock: 5,
    category: "Protective Gear",
  },
  {
    id: "4",
    name: "Training Jersey (Dry-Fit)",
    sku: "APP-TS-04",
    wishlistCount: 230,
    totalRequestedQty: 310,
    currentStock: 0,
    category: "Apparel",
  },
  {
    id: "5",
    name: "Duffle Bag (Elite)",
    sku: "BAG-EL-12",
    wishlistCount: 42,
    totalRequestedQty: 55,
    currentStock: 18,
    category: "Storage",
  },
];

const THEME_BLUE = "#0f3c63";
const THEME_YELLOW = "#facc15";

export default function WishlistStockManager() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = useMemo(() => {
    return WISHLIST_AGGREGATE_DATA.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Calculations for Summary Cards
  const totalWishlistedItems = WISHLIST_AGGREGATE_DATA.reduce(
    (acc, curr) => acc + curr.totalRequestedQty,
    0
  );
  const outOfStockDemand = WISHLIST_AGGREGATE_DATA.filter(
    (i) => i.currentStock === 0
  ).length;

  return (
    <div className="h-screen w-full bg-[#f4f7f9] flex flex-col overflow-hidden font-sans">
      {/* --- HEADER --- */}
      <div
        className="px-8 py-6 flex items-center justify-between shrink-0 text-white shadow-lg"
        style={{ backgroundColor: THEME_BLUE }}
      >
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-2.5 rounded-xl border border-white/10">
            <Heart size={24} className="fill-yellow-400 text-yellow-400" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight uppercase">
              Wishlist Demand Forecasting
            </h1>
            <p className="text-[10px] text-blue-200 font-bold tracking-[0.2em]">
              Aggregate User Interest vs Current Inventory
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300"
              size={16}
            />
            <input
              type="text"
              placeholder="Search demand..."
              className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder:text-blue-300 outline-none focus:bg-white/20 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-2.5 bg-white/10 hover:bg-white/20 rounded-lg transition-all border border-white/10">
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* --- SUMMARY STATS --- */}
      <div className="grid grid-cols-4 gap-6 px-8 py-8 shrink-0">
        <StatCard
          label="Total Items in Wishlists"
          value={totalWishlistedItems}
          icon={<TrendingUp size={20} />}
          color={THEME_BLUE}
        />
        <StatCard
          label="Unique Products"
          value={WISHLIST_AGGREGATE_DATA.length}
          icon={<Package size={20} />}
          color={THEME_BLUE}
        />
        <StatCard
          label="Out of Stock (Demand)"
          value={outOfStockDemand}
          icon={<AlertTriangle size={20} />}
          color="#ef4444"
          highlight
        />
        <StatCard
          label="Stock Adjustment Gap"
          value="1,240 Units"
          icon={<BarChart3 size={20} />}
          color={THEME_YELLOW}
          darkText
        />
      </div>

      {/* --- MAIN TABLE --- */}
      <div className="flex-1 overflow-auto px-8 pb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50 sticky top-0 z-10 border-b border-gray-100">
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <th className="px-8 py-5">Product Details</th>
                <th className="px-6 py-5 text-center">Interested Users</th>
                <th className="px-6 py-5 text-center">Total Qty Desired</th>
                <th className="px-6 py-5 text-center">Current Stock</th>
                <th className="px-6 py-5 text-center">Restock Required</th>
                <th className="px-8 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredData.map((item) => {
                const stockGap = Math.max(
                  0,
                  item.totalRequestedQty - item.currentStock
                );
                return (
                  <tr
                    key={item.id}
                    className="hover:bg-blue-50/30 transition-all group"
                  >
                    <td className="px-8 py-5">
                      <div className="font-bold text-gray-800 group-hover:text-[#0f3c63]">
                        {item.name}
                      </div>
                      <div className="text-[10px] font-mono text-gray-400 uppercase">
                        {item.sku} • {item.category}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center font-bold text-gray-600">
                      {item.wishlistCount} Users
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="text-sm font-black text-[#0f3c63]">
                        {item.totalRequestedQty}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div
                        className={`text-xs font-bold ${
                          item.currentStock < 10
                            ? "text-red-500"
                            : "text-green-600"
                        }`}
                      >
                        {item.currentStock} Units
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      {stockGap > 0 ? (
                        <div className="flex flex-col items-center">
                          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-[10px] font-black uppercase tracking-tighter">
                            + {stockGap} Units
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] font-bold text-gray-300 uppercase">
                          Fulfilled
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="px-4 py-2 bg-gray-100 hover:bg-[#0f3c63] hover:text-white rounded-lg text-[10px] font-black uppercase transition-all flex items-center gap-2 ml-auto border border-gray-200">
                        Create PO <ArrowUpRight size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENT ---
function StatCard({
  label,
  value,
  icon,
  color,
  highlight = false,
  darkText = false,
}: any) {
  return (
    <div
      className={`p-6 rounded-2xl shadow-sm border flex items-center justify-between transition-transform hover:scale-[1.02] ${
        highlight ? "bg-red-50 border-red-100" : "bg-white border-gray-100"
      }`}
    >
      <div className="flex flex-col">
        <span
          className={`text-[10px] font-black uppercase tracking-[0.1em] mb-1 ${
            highlight ? "text-red-400" : "text-gray-400"
          }`}
        >
          {label}
        </span>
        <span
          className="text-2xl font-black"
          style={{
            color: highlight ? "#ef4444" : darkText ? "#0f3c63" : color,
          }}
        >
          {value}
        </span>
      </div>
      <div
        className="p-3 rounded-xl"
        style={{ backgroundColor: `${color}15`, color: color }}
      >
        {icon}
      </div>
    </div>
  );
}
